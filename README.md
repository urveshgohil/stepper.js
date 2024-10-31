# stepper.JS 2.2.12

Enhances UI with intuitive step-by-step navigation with stepper vanilla JS library.
`Stepper.JS` is a versatile vanilla JavaScript library designed to simplify the implementation of step-by-step user interfaces. With `Stepper.JS`, developers can create intuitive and interactive workflows, guiding users through complex processes with ease. Let's delve into the documentation to explore its features, usage, and customization options.

## Introduction to Stepper.JS

`Stepper.JS` version 2.2.12 is new features, 10% faster and more flexible JavaScript library compared to the previous version, enabling developers to easily build step-by-step navigation. Whether you're designing a multi-step form, a guided tour, or a wizard-like interface, `Stepper.JS` provides the necessary tools to streamline the user experience. (1T ops/s ± 54.5% Fastest)

## Features

`Stepper.JS` offers a range of features to enhance UI navigation:
1. **Step-by-Step Navigation**: Easily organize content into sequential steps, guiding users through a predefined workflow.
2. **Intuitive Interface**: The intuitive interface ensures users understand their progress and the next steps to take.
3. **Customizable**: Customize the appearance and behavior of the stepper to match your application's design and requirements.
4. **Responsive Design**: `Stepper.JS` adapts seamlessly to various screen sizes, ensuring a consistent user experience across devices.

## Getting Started

To start using `Stepper.JS` in your project, follow these simple steps:
1. **Include the Library**: Add the `Stepper.JS` library to your project. You can either download the library files.
2. **HTML Structure**: Define the HTML structure for your stepper interface. Use div elements with appropriate classes to represent tabs, content panes, and navigation buttons.
3. **Initialize the Stepper**: Initialize the stepper by calling the stepper function and passing the container selector along with any optional configuration options.
4. **Customize**: Customize the stepper by adjusting options such as container width, indicator visibility, and callback functions for button events.

## Example Usage
### [Stepper.JS Demo](https://urveshgohil.in/stepper/index.html)

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="assets/css/stepper.css">
</head>
<body>
    <div class="st-container" st-container-1>
        <div class="st-group">
            <div class="st-tabs">
                <div class="st-tab">
                    <div class="st-tab-block">
                        <h3>Title</h3>
                    </div>
                </div>
                <div class="st-tab">
                    <div class="st-tab-block">
                        <h3>Title</h3>
                    </div>
                </div>
                <div class="st-tab">
                    <div class="st-tab-block">
                        <h3>Title</h3>
                    </div>
                </div>
            </div>
            <div class="st-content">
                <div class="st-pane">
                    Step 1
                </div>
                <div class="st-pane">
                    Step 2
                </div>
                <div class="st-pane">
                    Step 3
                </div>
            </div>
            <div class="st-bottom d-flex flex-wrap justify-content-between">
                <div>
                    <button type="button" class="st-button prev-step">Previous</button>
                </div>
                <div>
                    <button type="button" class="st-button next-step ml-1">Next</button>
                    <button type="button" class="st-button submit-step ml-1">Submit</button>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/stepper.min.JS"></script>
    <script>
        const stepper1 = stepper('[st-container-1]',
            options = {
                containerWidth: 420,
                indicator: {
                    visible: true,
                    theme: "Default",
                },
                submitted: true,
                allTabsDisabled: true,
                containerId: (id) => {
                    console.log(id);
                },
                nextButtonEvent: (e, options) => {
                    console.log('Next button clicked!');
                    options.nextButtonProcess(options.currentStep);
                },
                prevButtonEvent: (e) => {
                    console.log('Prev button clicked!');
                },
                submitButtonEvent: (e) => {
                    console.log('Submit button clicked!');
                },
                tabButtonEvent:(e) => {
                    console.log('Tab button clicked!');
                }
            }
        );
    </script>
</body>
</html>
```

## options

| Name                        | Type                       | Default Value           | Description                                                                                                                                                                    |
| --------------------------- | -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **options**                 | Object                     | {}                      | Options                                                                                                                                                                        |
| 1. **containerWidth**       | Number                     | 420                     | Specify the container width to enable responsive tab functionality, allowing scrolling when necessary on the current screen.                                                   |
| 2. **indicator**            | Object                     | {}                      | Controls indicator visibility and theme selection.                                                                                                                             |
| 2.1. **visible**            | Boolean                    | false                   | Provide a visual cue for the active tab number, enhancing user experience and navigation clarity.                                                                              |
| 2.2. **theme**              | String                     | `Default`               | Allows selection between `Default` and `Classic` tab themes.                                                                                                                   |
| 3. **allTabsDisabled**      | Boolean                    | true                    | Enables all tabs to be clickable on load.                                                                                                                                      |
| 4. **containerId**          | Number                     | {{dynamic}}             | Assigns a unique ID to the stepper container.                                                                                                                                  |
| 5. **nextButtonEvent**      | Function                   | () => {}                | Implement functionality to respond to the 'Next' button click event, facilitating seamless progression through the navigation flow.                                            |
| 5.1. **currentStep**        | Number                     | 1                       | Utilize the provided value in the parameters to set the current step. This functionality is an option available within the nextButtonEvent configuration.                      |
| 5.2. **nextButtonProcess**  | Function                   | () => {}                | Employ the function provided in the parameters to advance to the next step upon clicking the next button. This action is facilitated through the nextButtonEvent option.       |
| 6. **prevButtonEvent**      | Function                   | () => {}                | Implement functionality to respond to the 'Previous' button click event, enabling users to navigate back through the steps if needed.                                          |
| 7. **submitButtonEvent**    | Function                   | () => {}                | Implement functionality to respond to the 'Submit' button click event, allowing users to finalize and submit their inputs or selections.                                       |
| 8. **tabButtonEvent**       | Function                   | () => {}                | Implement functionality to respond to the 'Tab' button click event, allowing users to using tab button event handler.                                                          |
| 9. **submitted**            | Boolean                    | false                   | All stepper tabs become active for editing a previously submitted form. In the edit mode, the user should be able to jump between steps and make changes without restrictions  |