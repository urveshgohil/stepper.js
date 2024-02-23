/* Stepper Vanilla JS Library v1.3.3
=================================================================================
---------------------------------------------------------------------------------
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
const stepper = (containerId, options ={}) => {
    const CONTAINER = document.getElementById(containerId);
    let currentStep = 1;
    const TOTALSTEPS = CONTAINER.querySelectorAll('.stepper-tab').length;
    let containerWidth = options.containerWidth || 420;
    let indicatorVisible = options.indicatorVisible || false;
    let doneProcess = options.doneProcess || false;
    let nextButtonEvent =  options.nextButtonEvent ? options.nextButtonEvent : undefined;
    let prevButtonEvent =  options.prevButtonEvent ? options.prevButtonEvent : undefined;
    let submitButtonEvent =  options.submitButtonEvent ? options.submitButtonEvent : undefined;

    if(indicatorVisible) {
        const STEPPERINDICATORHTML = `<div class="stepper-indicator-main">
            <span class="stepper-indicator-group">
                ${Array.from({ length: TOTALSTEPS }, (_, index) => `<span class="stepper-indicator"></span>`).join('')}
            </span>
            <span class="stepper-position-group"><span class="stepper-position">${currentStep}</span>/<span class="stepper-total">${TOTALSTEPS}</span></span>
        </div>`;
        const STEPPERINDICATORELEMENT = CONTAINER.querySelector('.stepper-indicator-main');
        if(STEPPERINDICATORELEMENT === null) {
            const STEPPERGROUP = CONTAINER.querySelector('[data-id="stepper-group"]');
            STEPPERGROUP.insertAdjacentHTML('beforebegin', STEPPERINDICATORHTML);
        }
    }

    if (currentStep === 1) {
        CONTAINER.querySelectorAll('.stepper-tab').forEach(tabs => {tabs.classList.remove('active');});
        CONTAINER.querySelectorAll('.stepper-pane').forEach(panes => {panes.classList.remove('show');});
        CONTAINER.querySelector('.stepper-tab').classList.add('active');
        CONTAINER.querySelector('.stepper-pane').classList.add('show');
        CONTAINER.querySelector('.prev-step').style.display = 'none';
        if(CONTAINER.querySelector('.submit-step')) {
            CONTAINER.querySelector('.submit-step').style.display = 'none';
        }
    }

    CONTAINER.querySelectorAll('.stepper-tab').forEach(tab => {
        tab.addEventListener('click', (event) => {
            let clickedStep = parseInt(event.currentTarget.dataset.id.split('-')[1]);
            switchTabAndPane(clickedStep);
        });
    });

    CONTAINER.querySelector('.next-step').addEventListener('click', (e) => {
        if (currentStep < TOTALSTEPS) {
            currentStep++;
            let dataDisabled = CONTAINER.querySelector(`.stepper-tab[data-id="stepper-${currentStep}"]`).getAttribute('data-disabled');
            if (dataDisabled === "true") {
                CONTAINER.querySelector(`.stepper-tab[data-id="stepper-${currentStep}"]`).setAttribute('data-disabled', 'false');
            }
            switchTabAndPane(currentStep);
        }
        if (nextButtonEvent && typeof nextButtonEvent === 'function') {
            nextButtonEvent(e)
        }
    });

    CONTAINER.querySelector('.prev-step').addEventListener('click', (e) => {
        if (currentStep > 1) {
            currentStep--;
            switchTabAndPane(currentStep);
        }
        if (prevButtonEvent && typeof prevButtonEvent === 'function') {
            prevButtonEvent(e)
        }
    });

    if (submitButtonEvent && typeof submitButtonEvent === 'function') {
        CONTAINER.querySelector('.submit-step').addEventListener('click', submitButtonEvent);
    }

    const getPosition = () => {
        CONTAINER.querySelectorAll('.stepper-tab').forEach(tab => {
            if(tab.classList.contains('active')) {
                const TABOFFSETLEFT = tab.offsetLeft;
                setTimeout(()=>{
                    CONTAINER.querySelector('.stepper-tabs-scroll').scroll({
                        left: TABOFFSETLEFT,
                        behavior: 'smooth'
                    });
                },0)
            }
        });
    }

    const switchTabAndPane = (step) => {
        currentStep = step;
        CONTAINER.querySelector('.stepper-tab.active').classList.remove('active');
        CONTAINER.querySelector(`[data-id="stepper-${step}"]`).classList.add('active');
        CONTAINER.querySelector('.stepper-pane.show').classList.remove('show');
        CONTAINER.querySelector(`[data-id="pane-${step}"]`).classList.add('show');

        if(doneProcess) {
            CONTAINER.querySelectorAll('.stepper-tab').forEach((tab, index) => {
                if (index < step - 1) {
                    tab.classList.add('step-done');
                }
            });
        }
        if(indicatorVisible) {
            CONTAINER.querySelectorAll('.stepper-indicator').forEach((indicator, index) => {
                if (index < step - 1) {
                    indicator.classList.add('step-done');
                }
            });
        }

        updateButtonVisibility(step);
        if(indicatorVisible) {
            updateStepper(step);
        }
        if(CONTAINER.offsetWidth <= containerWidth) {
            getPosition();
        }
        window.removeEventListener('resize', function() {if(CONTAINER.offsetWidth <= containerWidth) {getPosition();}}, true);
        window.addEventListener('resize', function() {if(CONTAINER.offsetWidth <= containerWidth) {getPosition();}}, true);
    }

    const updateButtonVisibility = (currentStep) => {
        if (currentStep === 1) {
            CONTAINER.querySelector('.prev-step').style.display = 'none';
        } else {
            CONTAINER.querySelector('.prev-step').style.display = 'block';
        }

        if (currentStep === TOTALSTEPS) {
            CONTAINER.querySelector('.next-step').style.display = 'none';
            if(CONTAINER.querySelector('.submit-step')) {
                CONTAINER.querySelector('.submit-step').style.display = 'block';
            }
        } else {
            CONTAINER.querySelector('.next-step').style.display = 'block';
            if(CONTAINER.querySelector('.submit-step')) {
                CONTAINER.querySelector('.submit-step').style.display = 'none';
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
    if(indicatorVisible) {
        updateStepper(currentStep);
    }
}