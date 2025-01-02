document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("frameFitCalc");
    const clearButton = document.getElementById("clearButton");
    const calculatedResultsSection = document.getElementById("calculated-results");

    // Frame calculator data
    const frameSizeData = {
        1: { reach: 356, stack: 541 },
        2: { reach: 367, stack: 558 },
        3: { reach: 378, stack: 579 },
        4: { reach: 390, stack: 597 },
        5: { reach: 401, stack: 614 },
        6: { reach: 413, stack: 632 },
        7: { reach: 425, stack: 654 },
        8: { reach: 436, stack: 671 }
    };
    const stemAngles = [-17, -7, -6, 0, 6, 7, 17];
    const stemLengths = [50, 60, 70, 80, 90];
    const spacerStackOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

    // Event listener for form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const isStackValid = validateHandlebarStack();
        const isReachValid = validateHandlebarReach();

        // Only calculate results if both fields are valid
        if (isStackValid && isReachValid) {
            calculateResults();
            showResults();
            calculatedResultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Event listener for clear button
    clearButton.addEventListener("click", function () {
        form.reset(); // Clear form inputs
        clearResults(); // Clear displayed results and error messages
    });

    // Function to show results
    function showResults() {
        calculatedResultsSection.classList.remove("hidden");
    }

    // Function to hide results
    function hideResults() {
        calculatedResultsSection.classList.add("hidden");
    }

    // Function to clear results
    function clearResults() {
        document.getElementById("user-handlebar-stack").textContent = '';
        document.getElementById("user-handlebar-reach").textContent = '';
        document.getElementById("best-handlebar-stack").textContent = '';
        document.getElementById("best-handlebar-reach").textContent = '';
        document.getElementById("best-frame-size").textContent = '';
        document.getElementById("best-stem-angle").textContent = '';
        document.getElementById("best-stem-length").textContent = '';
        document.getElementById("best-spacer-stack").textContent = '';
        document.getElementById("neg-stem-handlebar-stack").textContent = '';
        document.getElementById("neg-stem-handlebar-reach").textContent = '';
        document.getElementById("neg-stem-frame-size").textContent = '';
        document.getElementById("neg-stem-angle").textContent = '';
        document.getElementById("neg-stem-length").textContent = '';
        document.getElementById("neg-stem-spacer-stack").textContent = '';
        document.getElementById("user_handlebar_stack_error").textContent = '';
        document.getElementById("user_handlebar_reach_error").textContent = '';
    }

    // Validation functions
    function validateHandlebarStack() {
        const userStack = parseFloat(document.getElementById("user_handlebar_stack").value.trim());
        const errorMessage = document.getElementById("user_handlebar_stack_error");
        if (isNaN(userStack) || userStack < 540 || userStack > 750) {
            errorMessage.textContent = "Please enter a number between 540 and 750.";
            return false;
        }
        errorMessage.textContent = "";
        return true;
    }

    function validateHandlebarReach() {
        const userReach = parseFloat(document.getElementById("user_handlebar_reach").value.trim());
        const errorMessage = document.getElementById("user_handlebar_reach_error");
        if (isNaN(userReach) || userReach < 375 || userReach > 520) {
            errorMessage.textContent = "Please enter a number between 375 and 520.";
            return false;
        }
        errorMessage.textContent = "";
        return true;
    }

    // Function to calculate the best fit results based on user input
    function calculateResults() {
        const userStack = parseFloat(document.getElementById("user_handlebar_stack").value.trim());
        const userReach = parseFloat(document.getElementById("user_handlebar_reach").value.trim());

        let closestMatch = null;
        let closestDiff = Infinity;
        let closestNegStemMatch = null;
        let closestNegStemDiff = Infinity;

        for (let frameSize = 1; frameSize <= 8; frameSize++) {
            const maxSpacerStack = frameSize === 8 ? 10 : Math.max(...spacerStackOptions); // Limit to 10mm for M8

            for (let stemAngle of stemAngles) {
                for (let stemLength of stemLengths) {
                    for (let spacerStack of spacerStackOptions) {
                        if (spacerStack > maxSpacerStack) continue; // Skip if spacerStack exceeds the limit

                        const { handlebarStack, handlebarReach } = calculateHandlebarGeometry(frameSize, stemAngle, stemLength, spacerStack);
                        const totalDiff = Math.abs(handlebarStack - userStack) + Math.abs(handlebarReach - userReach);

                        if (totalDiff < closestDiff) {
                            closestDiff = totalDiff;
                            closestMatch = { frameSize, stemAngle, stemLength, spacerStack, handlebarStack, handlebarReach };
                        }

                        if (stemAngle < 0 && totalDiff < closestNegStemDiff) {
                            closestNegStemDiff = totalDiff;
                            closestNegStemMatch = { frameSize, stemAngle, stemLength, spacerStack, handlebarStack, handlebarReach };
                        }
                    }
                }
            }
        }

        // Display results
        document.getElementById("user-handlebar-stack").textContent = `${userStack}`;
        document.getElementById("user-handlebar-reach").textContent = `${userReach}`;
        document.getElementById("best-handlebar-stack").textContent = `${closestMatch.handlebarStack}`;
        document.getElementById("best-handlebar-reach").textContent = `${closestMatch.handlebarReach}`;
        document.getElementById("best-frame-size").textContent = `M${closestMatch.frameSize}`;
        document.getElementById("best-stem-angle").textContent = `${closestMatch.stemAngle}`;
        document.getElementById("best-stem-length").textContent = `${closestMatch.stemLength}`;
        document.getElementById("best-spacer-stack").textContent = `${closestMatch.spacerStack}`;

        if (closestNegStemMatch) {
            document.getElementById("neg-stem-handlebar-stack").textContent = `${closestNegStemMatch.handlebarStack}`;
            document.getElementById("neg-stem-handlebar-reach").textContent = `${closestNegStemMatch.handlebarReach}`;
            document.getElementById("neg-stem-frame-size").textContent = `M${closestNegStemMatch.frameSize}`;
            document.getElementById("neg-stem-angle").textContent = `${closestNegStemMatch.stemAngle}`;
            document.getElementById("neg-stem-length").textContent = `${closestNegStemMatch.stemLength}`;
            document.getElementById("neg-stem-spacer-stack").textContent = `${closestNegStemMatch.spacerStack}`;
        } else {
            document.getElementById("neg-stem-handlebar-stack").textContent = 'N/A';
            document.getElementById("neg-stem-handlebar-reach").textContent = 'N/A';
            document.getElementById("neg-stem-frame-size").textContent = 'N/A';
            document.getElementById("neg-stem-angle").textContent = 'N/A';
            document.getElementById("neg-stem-length").textContent = 'N/A';
            document.getElementById("neg-stem-spacer-stack").textContent = 'N/A';
        }
    }

    // Function to calculate handlebar geometry
    function calculateHandlebarGeometry(frameSize, stemAngle, stemLength, spacerStack) {
        const frameData = frameSizeData[frameSize];
        const headTubeAngle = 70.5;
        const headsetStack = 16;
        const stemStackHeight = 40;

        const handlebarStack = Math.round(
            Math.sin(toRadians(90 + headTubeAngle - stemAngle)) * stemLength +
            Math.cos(toRadians(90 - headTubeAngle)) * (headsetStack + spacerStack + (stemStackHeight / 2)) +
            frameData.stack
        );

        const handlebarReach = Math.round(
            frameData.reach -
            Math.sin(toRadians(90 - headTubeAngle)) * (headsetStack + spacerStack + (stemStackHeight / 2)) +
            Math.cos(toRadians(90 - headTubeAngle + stemAngle)) * stemLength
        );

        return { handlebarStack, handlebarReach };
    }

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
});
