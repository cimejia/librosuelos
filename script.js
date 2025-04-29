        const bookContainer = document.getElementById('bookContainer');
        const ebook = document.getElementById('ebook');
        const prevIcon = document.getElementById('prevIcon');
        const nextIcon = document.getElementById('nextIcon');
        const firstPageIcon = document.getElementById('firstPageIcon');
        const lastPageIcon = document.getElementById('lastPageIcon');
        const zoomInIcon = document.getElementById('zoomInIcon');
        const zoomOutIcon = document.getElementById('zoomOutIcon');
        const pageNumberDisplay = document.getElementById('pageNumber');


        // IMPORTANT: Replace these with the URLs of your PDF page images
        // Ensure you have an image for each page of your PDF.
        const pageImages = [
            'https://placehold.co/400x600/E0E0E0/333?text=Page+1', // Replace with URL for page 1
            'https://placehold.co/400x600/D0D0D0/333?text=Page+2', // Replace with URL for page 2
            'https://placehold.co/400x600/C0C0C0/333?text=Page+3', // Replace with URL for page 3
            'https://placehold.co/400x600/B0B0B0/333?text=Page+4', // Replace with URL for page 4
            'https://placehold.co/400x600/A0A0A0/333?text=Page+5', // Replace with URL for page 5
            'https://placehold.co/400x600/909090/333?text=Page+6', // Replace with URL for page 6
             // Add more image URLs for each page of your PDF
        ];

        let currentPage = 0; // Start at the cover (index 0)
        let zoomLevel = 1; // Initial zoom level

        // Function to create and add pages to the DOM
        function createPages() {
            ebook.innerHTML = ''; // Clear existing pages
            pageImages.forEach((imageUrl, index) => {
                const page = document.createElement('div');
                page.classList.add('page');
                // Add a unique data attribute to identify the page number
                page.dataset.pageIndex = index;

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `Page ${index + 1}`;
                // Add error handling for images
                img.onerror = function() {
                    console.error(`Failed to load image: ${imageUrl}`);
                    // Optionally display a placeholder or error message on the page
                    page.innerHTML = '<p style="text-align: center; color: red;">Error loading page.</p>';
                };

                page.appendChild(img);
                ebook.appendChild(page);
            });
            updatePageDisplay(); // Set initial page visibility and controls state
        }

        // Function to update which pages are visible and flipped
        function updatePageDisplay() {
            const pages = ebook.querySelectorAll('.page');
            const totalPages = pageImages.length;

            pages.forEach((page, index) => {
                const pageIndex = parseInt(page.dataset.pageIndex);

                // Hide all pages initially
                page.style.display = 'none';
                page.classList.remove('flipped'); // Ensure no pages are initially flipped

                // Determine which pages should be visible based on currentPage
                if (currentPage === 0) {
                    // Show the cover page (page 0)
                    if (pageIndex === 0) {
                         page.style.display = 'flex'; // Use flex to center content if needed
                         page.style.zIndex = totalPages; // Ensure cover is on top initially
                         page.style.transform = 'rotateY(0deg)'; // Ensure cover is not flipped
                         page.style.left = '0'; // Position cover on the left side
                         page.style.right = 'auto'; // Ensure right is auto for full width page
                         page.style.width = '100%'; // Cover takes full book width
                         page.style.borderRadius = '10px'; // Rounded corners for the cover
                    }
                } else {
                     // Show the current left page (currentPage - 1) and right page (currentPage)
                     const leftPageIndex = currentPage - 1;
                     const rightPageIndex = currentPage;

                    if (pageIndex === leftPageIndex || pageIndex === rightPageIndex) {
                        page.style.display = 'flex';
                        page.style.width = '50%'; // Back to half width for spreads
                        page.style.borderRadius = pageIndex === leftPageIndex ? '10px 0 0 10px' : '0 10px 10px 0'; // Apply correct border radius

                        // Determine z-index for layering during flips
                        // Pages further into the book should have lower z-index when not flipped
                        page.style.zIndex = totalPages - pageIndex;

                        // Set flipped state based on current page
                        if (pageIndex < currentPage) {
                             // Pages before the current spread should be flipped
                             page.classList.add('flipped');
                             // Position flipped pages correctly on the left side
                             page.style.left = '0';
                             page.style.right = 'auto';

                        } else {
                             // Pages on the current spread or after should not be flipped initially
                             page.classList.remove('flipped');
                             // Position non-flipped pages correctly
                             if (pageIndex === leftPageIndex) {
                                  page.style.left = '0';
                                  page.style.right = 'auto';
                             } else if (pageIndex === rightPageIndex) {
                                  page.style.right = '0';
                                  page.style.left = 'auto';
                             }
                        }
                    }
                }
            });

            // Update page number display
            if (currentPage === 0) {
                pageNumberDisplay.textContent = `Página 1 de ${totalPages}`;
            } else {
                // Display the range of pages currently visible
                const startPage = currentPage; // The right page index is the start of the spread
                const endPage = Math.min(currentPage + 1, totalPages -1); // The left page index is current page - 1
                 // Adjusting for 1-based indexing for display
                const displayStartPage = currentPage;
                const displayEndPage = Math.min(currentPage + 1, totalPages - 1);

                 if (displayStartPage === displayEndPage) {
                     pageNumberDisplay.textContent = `Página ${displayStartPage + 1} de ${totalPages}`;
                 } else {
                    pageNumberDisplay.textContent = `Páginas ${displayStartPage + 1}-${displayEndPage + 1} de ${totalPages}`;
                 }

            }


            // Adjust icon disabled state
            if (currentPage === 0) {
                prevIcon.classList.add('disabled');
                firstPageIcon.classList.add('disabled');
            } else {
                prevIcon.classList.remove('disabled');
                firstPageIcon.classList.remove('disabled');
            }

            // Disable next and last page if at the last spread or last page
            // The last possible 'currentPage' index for a spread is totalPages - 2 (if totalPages is even)
            // or totalPages - 1 (if totalPages is odd, the last page will be a single page on the right)
             const lastPageIndex = totalPages - 1;
             const lastSpreadStartIndex = totalPages % 2 === 0 ? totalPages - 2 : totalPages - 1;


            if (currentPage >= lastSpreadStartIndex) {
                 nextIcon.classList.add('disabled');
                 lastPageIcon.classList.add('disabled');
            } else {
                 nextIcon.classList.remove('disabled');
                 lastPageIcon.classList.remove('disabled');
            }

             // Disable zoom out if at minimum zoom level
            if (zoomLevel <= 0.5) { // Define a minimum zoom level
                zoomOutIcon.classList.add('disabled');
            } else {
                zoomOutIcon.classList.remove('disabled');
            }

            // Disable zoom in if at maximum zoom level
            if (zoomLevel >= 2) { // Define a maximum zoom level
                zoomInIcon.classList.add('disabled');
            } else {
                zoomInIcon.classList.remove('disabled');
            }
        }


        // Event listeners for icons
        nextIcon.addEventListener('click', () => {
            // Check if the icon is not disabled
            if (!nextIcon.classList.contains('disabled')) {
                 const totalPages = pageImages.length;
                 const lastSpreadStartIndex = totalPages % 2 === 0 ? totalPages - 2 : totalPages - 1;

                 if (currentPage < lastSpreadStartIndex) {
                      // If on the cover, move to the first spread (pages 1 and 2)
                      if (currentPage === 0) {
                         currentPage = 1;
                      } else {
                          // Otherwise, move to the next spread (increment by 2 pages)
                          currentPage += 2;
                      }
                      updatePageDisplay();
                 }
            }
        });

        prevIcon.addEventListener('click', () => {
             // Check if the icon is not disabled
            if (!prevIcon.classList.contains('disabled')) {
                if (currentPage > 0) {
                     // If moving back from the first spread, go to the cover
                     if (currentPage === 1) {
                        currentPage = 0;
                     } else {
                         // Otherwise, move back two pages
                         currentPage -= 2;
                     }
                     updatePageDisplay();
                }
            }
        });

        firstPageIcon.addEventListener('click', () => {
            if (!firstPageIcon.classList.contains('disabled')) {
                currentPage = 0; // Go to the cover page
                updatePageDisplay();
            }
        });

        lastPageIcon.addEventListener('click', () => {
             if (!lastPageIcon.classList.contains('disabled')) {
                 const totalPages = pageImages.length;
                 // Go to the last possible spread or the last single page
                 currentPage = totalPages % 2 === 0 ? totalPages - 2 : totalPages - 1;
                 updatePageDisplay();
            }
        });

        zoomInIcon.addEventListener('click', () => {
             if (!zoomInIcon.classList.contains('disabled')) {
                zoomLevel += 0.1; // Increase zoom level
                bookContainer.style.transform = `scale(${zoomLevel}) translateX(-50%)`; // Apply scale and maintain center
                updatePageDisplay(); // Update disabled state of zoom icons
            }
        });

        zoomOutIcon.addEventListener('click', () => {
             if (!zoomOutIcon.classList.contains('disabled')) {
                zoomLevel -= 0.1; // Decrease zoom level
                 // Ensure zoom level doesn't go below a minimum
                if (zoomLevel < 0.5) zoomLevel = 0.5;
                bookContainer.style.transform = `scale(${zoomLevel}) translateX(-50%)`; // Apply scale and maintain center
                updatePageDisplay(); // Update disabled state of zoom icons
            }
        });


        // Initialize the ebook
        createPages();

        // Handle window resize to potentially re-render pages for responsiveness
        window.addEventListener('resize', updatePageDisplay);
