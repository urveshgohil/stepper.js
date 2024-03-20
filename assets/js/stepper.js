/* Stepper Vanilla JS Library v1.4.1
=================================================================================
=================================================================================
Copyright 2024 Urvesh Gohil
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

"use strict";
const stepper = (containerId, options = {}) => {
    const CONTAINER = document.getElementById(containerId);
    let currentStep = 1;
    const TOTAL_STEPS = CONTAINER.querySelectorAll('.stepper-tab').length;
    let containerWidth = options.containerWidth || 420;
    let indicatorVisible = options.indicatorVisible || false;
    let doneProcess = options.doneProcess || false;
    let nextButtonEvent = options.nextButtonEvent || undefined;
    let prevButtonEvent = options.prevButtonEvent || undefined;
    let submitButtonEvent = options.submitButtonEvent || undefined;
    let tabButtonEvent = options.tabButtonEvent || undefined;

    if (indicatorVisible) {
        const STEPPER_INDICATOR_HTML = `<div class="stepper-indicator-main">
            <span class="stepper-indicator-group">
                ${Array.from({ length: TOTAL_STEPS }, (_, index) => `<span class="stepper-indicator"></span>`).join('')}
            </span>
            <span class="stepper-position-group"><span class="stepper-position">${currentStep}</span>/<span class="stepper-total">${TOTAL_STEPS}</span></span>
        </div>`;
        const STEPPER_INDICATOR_ELEMENT = CONTAINER.querySelector('.stepper-indicator-main');
        if (STEPPER_INDICATOR_ELEMENT === null) {
            const STEPPER_GROUP = CONTAINER.querySelector('[data-id="stepper-group"]');
            STEPPER_GROUP.insertAdjacentHTML('beforebegin', STEPPER_INDICATOR_HTML);
        }
    }

    if (currentStep === 1) {
        CONTAINER.querySelectorAll('.stepper-tab').forEach(tabs => { tabs.classList.remove('active'); });
        CONTAINER.querySelectorAll('.stepper-pane').forEach(panes => { panes.classList.remove('show'); });
        CONTAINER.querySelector('.stepper-tab').classList.add('active');
        CONTAINER.querySelector('.stepper-pane').classList.add('show');
        CONTAINER.querySelector('.next-step').setAttribute("aria-hidden", "false");
        CONTAINER.querySelector('.prev-step').setAttribute("aria-hidden", "true");
        if (CONTAINER.querySelector('.submit-step')) {
            CONTAINER.querySelector('.submit-step').setAttribute("aria-hidden", "true");
        }
    }

    const switchTabAndPane = (step) => {
        currentStep = step;
        CONTAINER.querySelector('.stepper-tab.active').classList.remove('active');
        CONTAINER.querySelector(`[data-id="stepper-${step}"]`).classList.add('active');
        CONTAINER.querySelector('.stepper-pane.show').classList.remove('show');
        CONTAINER.querySelector(`[data-id="pane-${step}"]`).classList.add('show');

        if (doneProcess) {
            CONTAINER.querySelectorAll('.stepper-tab').forEach((tab, index) => {
                if (index < step - 1) {
                    tab.classList.add('step-done');
                }
            });
        }
        if (indicatorVisible) {
            CONTAINER.querySelectorAll('.stepper-indicator').forEach((indicator, index) => {
                if (index < step - 1) {
                    indicator.classList.add('step-done');
                }
            });
        }

        updateButtonVisibility(step);
        if (indicatorVisible) {
            updateStepper(step);
        }
        if (CONTAINER.offsetWidth <= containerWidth) {
            getPosition();
        }

        const getPositionEvent = () => {
            if (CONTAINER.offsetWidth <= containerWidth) {
                getPosition();
            }
        }

        window.removeEventListener('resize', getPositionEvent);
        window.addEventListener('resize', getPositionEvent);
    }

    const updateButtonVisibility = (currentStep) => {
        if (currentStep === 1) {
            CONTAINER.querySelector('.prev-step').setAttribute("aria-hidden", "true");
        } else {
            CONTAINER.querySelector('.prev-step').setAttribute("aria-hidden", "false");
        }

        if (currentStep === TOTAL_STEPS) {
            CONTAINER.querySelector('.next-step').setAttribute("aria-hidden", "true");
            if (CONTAINER.querySelector('.submit-step')) {
                CONTAINER.querySelector('.submit-step').setAttribute("aria-hidden", "false");
            }
        } else {
            CONTAINER.querySelector('.next-step').setAttribute("aria-hidden", "false");
            if (CONTAINER.querySelector('.submit-step')) {
                CONTAINER.querySelector('.submit-step').setAttribute("aria-hidden", "true");
            }
        }
    }

    const updateStepper = (currentStep) => {
        CONTAINER.querySelectorAll('.stepper-indicator').forEach((indicator, index) => {
            if (index === (currentStep - 1)) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        CONTAINER.querySelector('.stepper-position').innerText = currentStep;
    }

    const stepperEventListener = (event) => {
        if (tabButtonEvent && typeof tabButtonEvent === 'function') {
            tabButtonEvent(event);
        }
        let clickedStep = parseInt(event.currentTarget.dataset.id.split('-')[1]);
        switchTabAndPane(clickedStep);
    }

    const nextButtonProcess = (currentStep) => {
        currentStep++;
        let dataDisabled = CONTAINER.querySelector(`.stepper-tab[data-id="stepper-${currentStep}"]`).getAttribute('data-disabled');
        if (dataDisabled === "true") {
            CONTAINER.querySelector(`.stepper-tab[data-id="stepper-${currentStep}"]`).setAttribute('data-disabled', 'false');
        }
        switchTabAndPane(currentStep);
    }
    const nextEventListener = (event) => {
        if (currentStep < TOTAL_STEPS) {
            if (nextButtonEvent && typeof nextButtonEvent === 'function') {

                nextButtonEvent(event, options = {
                    currentStep,
                    nextButtonProcess
                });
            }
        }
    }
    const prevEventListener = (event) => {
        if (currentStep > 1) {
            currentStep--;
            switchTabAndPane(currentStep);
        }
        if (prevButtonEvent && typeof prevButtonEvent === 'function') {
            prevButtonEvent(event)
        }
    }
    const submitEventListener = (event) => {
        submitButtonEvent(event);
    }

    CONTAINER.querySelectorAll('.stepper-tab').forEach(tab => {
        tab.removeEventListener('click', stepperEventListener);
        tab.addEventListener('click', stepperEventListener);
    });

    CONTAINER.querySelector('.next-step').removeEventListener('click', nextEventListener);
    CONTAINER.querySelector('.next-step').addEventListener('click', nextEventListener);

    CONTAINER.querySelector('.prev-step').removeEventListener('click', prevEventListener);
    CONTAINER.querySelector('.prev-step').addEventListener('click', prevEventListener);

    if (submitButtonEvent && typeof submitButtonEvent === 'function') {
        CONTAINER.querySelector('.submit-step').removeEventListener('click', submitEventListener);
        CONTAINER.querySelector('.submit-step').addEventListener('click', submitEventListener);
    }

    const getPosition = () => {
        CONTAINER.querySelectorAll('.stepper-tab').forEach(tab => {
            if (tab.classList.contains('active')) {
                const TAB_OFFSET_LEFT = tab.offsetLeft;
                setTimeout(() => {
                    CONTAINER.querySelector('.stepper-tabs-scroll').scroll({
                        left: TAB_OFFSET_LEFT,
                        behavior: 'smooth'
                    });
                }, 0)
            }
        });
    }

    if (indicatorVisible) {
        updateStepper(currentStep);
    }
}