/* Stepper Vanilla JS Library v2.0  */
"use strict";
const stepper = (selector, options = {}) => {
    const CONTAINER = document.querySelectorAll(selector);

    const NUMBER = () => Math.floor(10000 + Math.random() * 90000);
    const ATTRIBUTES = (element, attributes) => Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
    const TO = (value, optionalValue) => value ?? optionalValue;
    const AriaHidden = (element, value) => element.setAttribute("aria-hidden", value);
    const DataDisabled = (element, value) => element.setAttribute("data-disabled", value);

    const TabsWrapper = () => `<div class="st-tabs-scroll"><div class="st-tabs-wrapper"></div></div>`;
    const IndicatorWrapper = (children) => `<div class="st-indicator-main" role="indicator"><span class="st-indicator-group">${children}</div></div>`;
    const IndicatorClassic = (totalSteps, currentStep) => IndicatorWrapper(`${Array.from({ length: totalSteps }, () => `<span class="st-indicator"></span>`).join('')}</span>
        <span class="st-position-group"><span class="st-position">${currentStep}</span>/<span class="st-total">${totalSteps}</span>`);
    const IndicatorDefault = (totalSteps) => IndicatorWrapper(`${Array.from({ length: totalSteps }, (_, index) => `<span class="st-indicator"><span class="st-number">${index + 1}</span></span>`).join('')}</span>`);

    CONTAINER.forEach((CONTAINERS, INDEX) => {
        const DYNAMIC = NUMBER();
        const ID = `${DYNAMIC}${INDEX + 1}`;
        const stepperGroup = CONTAINERS.querySelector('.st-group');
        const stepperTab = CONTAINERS.querySelector('.st-tab');
        const stepperTabs = CONTAINERS.querySelectorAll('.st-tab');
        const stepperPane = CONTAINERS.querySelector('.st-pane');
        const stepperPanes = CONTAINERS.querySelectorAll('.st-pane');
        const nextStep = CONTAINERS.querySelector('.next-step');
        const prevStep = CONTAINERS.querySelector('.prev-step');
        const submitStep = CONTAINERS.querySelector('.submit-step');

        let currentStep = 1;
        const TOTAL_STEPS = stepperTabs.length;

        const containerWidth = TO(options?.containerWidth, 420);
        const indicatorVisible = TO(options?.indicator?.visible, false);
        const indicatorTheme = TO(options?.indicator?.theme, "Default");
        const doneProcess = TO(options?.doneProcess, false);
        const allTabsDisabled = TO(options?.allTabsDisabled, true);
        const nextButtonEvent = TO(options?.nextButtonEvent, undefined);
        const prevButtonEvent = TO(options?.prevButtonEvent, undefined);
        const submitButtonEvent = TO(options?.submitButtonEvent, undefined);
        const tabButtonEvent = TO(options?.tabButtonEvent, undefined);
        const containerId = TO(options?.containerId, undefined);

        CONTAINERS.classList.add(`st-theme-${indicatorTheme.toLowerCase()}`);
        const stepperTabsGroup = CONTAINERS.querySelector('.st-tabs');
        stepperTabsGroup.insertAdjacentHTML('beforeend', TabsWrapper());
        const stepperTabsWrapper = stepperTabsGroup.querySelector('.st-tabs-wrapper');

        ATTRIBUTES(CONTAINERS, {
            'id': `st-container-${ID}`,
            'data-id': `container-${ID}`,
            'role': `stepper`,
        });
        stepperTabs.forEach((t, i) => {
            stepperTabsWrapper.appendChild(t)
            ATTRIBUTES(t, {
                'data-id': `tab-${i + 1}`,
                'role': `tab`,
                'data-disabled': allTabsDisabled === false ? `false` : `true`,
            });
        });
        stepperPanes.forEach((p, i) => {
            ATTRIBUTES(p, {
                'data-id': `pane-${i + 1}`,
                'role': `pane`,
                'aria-hidden': `true`,
            });
        });

        if (indicatorVisible) {
            let INDICATOR_HTML = "";
            switch (indicatorTheme) {
                case "Default":
                    INDICATOR_HTML = IndicatorDefault(TOTAL_STEPS);
                    break;
                case "Classic":
                    INDICATOR_HTML = IndicatorClassic(TOTAL_STEPS, currentStep);
                    break;
                default:
                    INDICATOR_HTML = IndicatorDefault(TOTAL_STEPS, currentStep);
                    break;
            }
            const INDICATOR_ELEMENT = CONTAINERS.querySelector('.st-indicator-main');
            if (INDICATOR_ELEMENT === null) stepperGroup.insertAdjacentHTML('beforebegin', INDICATOR_HTML);
        };

        if (currentStep === 1) {
            stepperTabs.forEach(t => t.classList.remove('active'));
            stepperPanes.forEach(p => p.classList.remove('show'));
            stepperTab.classList.add('active');
            DataDisabled(stepperTab, "false");
            stepperPane.classList.add('show');
            AriaHidden(stepperPane, "false");
            ATTRIBUTES(nextStep, {
                'data-id': `next-${ID}`,
                'aria-hidden': `false`,
                'role': `button`,
            });
            ATTRIBUTES(prevStep, {
                'data-id': `prev-${ID}`,
                'aria-hidden': `true`,
                'role': `button`,
            });
            if (submitStep) {
                ATTRIBUTES(submitStep, {
                    'data-id': `submit-${ID}`,
                    'aria-hidden': `true`,
                    'role': `button`,
                });
            };
        };

        const containerIDS = (id) => {
            if (containerId && typeof containerId === 'function') containerId(id);
        };

        const switchTabAndPane = (step) => {
            currentStep = step;
            const activeTab = CONTAINERS.querySelector('.st-tab.active');
            if (activeTab) activeTab.classList.remove('active');
            const stepTab = CONTAINERS.querySelector(`[data-id="tab-${step}"]`)
            if (stepTab) stepTab.classList.add('active');
            AriaHidden(CONTAINERS.querySelector('.st-pane.show'), "true");
            const showPane = CONTAINERS.querySelector('.st-pane.show')
            if (showPane) showPane.classList.remove('show');
            const stepPane = CONTAINERS.querySelector(`[data-id="pane-${step}"]`)
            if (stepPane) stepPane.classList.add('show');
            AriaHidden(CONTAINERS.querySelector(`[data-id="pane-${step}"]`), "false");

            if (doneProcess || indicatorVisible) {
                stepperTabs.forEach((t, i) => {
                    if (i < step - 1) {
                        if (doneProcess) t.classList.add('step-done');
                        if (indicatorVisible) {
                            const ind = CONTAINERS.querySelector(`.st-indicator:nth-child(${i + 1})`);
                            if (ind) ind.classList.add('step-done');
                        }
                    }
                });
            }

            updateButtonVisibility(step);
            if (indicatorVisible) updateStepper(step);
            if (CONTAINERS.offsetWidth <= containerWidth) getPosition();

            let resizeTimeout;

            const getPositionEvent = () => {
                if (resizeTimeout) {
                    cancelAnimationFrame(resizeTimeout);
                }
                resizeTimeout = requestAnimationFrame(() => {
                    if (CONTAINERS.offsetWidth <= containerWidth) getPosition();
                });
            };
            window.addEventListener('resize', getPositionEvent);
        };

        const updateButtonVisibility = (currentStep) => {
            if (currentStep === 1) {
                AriaHidden(prevStep, "true");
            } else {
                AriaHidden(prevStep, "false");
            };

            if (currentStep === TOTAL_STEPS) {
                AriaHidden(nextStep, "true");
                if (submitStep) {
                    AriaHidden(submitStep, "false");
                };
            } else {
                AriaHidden(nextStep, "false");
                if (submitStep) {
                    AriaHidden(submitStep, "true");
                };
            };
        };

        const updateStepper = (currentStep) => {
            CONTAINERS.querySelectorAll('.st-indicator').forEach((ind, i) => {
                if (i === (currentStep - 1)) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                };
            });

            if (indicatorTheme !== "Default") CONTAINERS.querySelector('.st-position').innerText = currentStep;
        };

        const stepperEventListener = (event) => {
            const currentTab = event.currentTarget;
            if (!currentTab.classList.contains('active')) {
                if (tabButtonEvent && typeof tabButtonEvent === 'function') tabButtonEvent(event, ID);
                const clickedStep = parseInt(currentTab.dataset.id.split('-')[1]);
                switchTabAndPane(clickedStep);
            }
        };

        const nextButtonProcess = (currentStep) => {
            currentStep++;
            const dataDisabled = CONTAINERS.querySelector(`.st-tab[data-id="tab-${currentStep}"]`).getAttribute('data-disabled');
            if (dataDisabled === "true") DataDisabled(CONTAINERS.querySelector(`.st-tab[data-id="tab-${currentStep}"]`), "false");
            switchTabAndPane(currentStep);
        };

        const nextEventListener = (event) => {
            if (currentStep < TOTAL_STEPS) {
                if (nextButtonEvent && typeof nextButtonEvent === 'function') {
                    nextButtonEvent(event, options = {
                        currentStep,
                        nextButtonProcess,
                        id: ID
                    });
                };
            };
        };

        const prevEventListener = (event) => {
            if (currentStep > 1) {
                currentStep--;
                switchTabAndPane(currentStep);
            };
            if (prevButtonEvent && typeof prevButtonEvent === 'function') prevButtonEvent(event, ID);
        };

        const submitEventListener = (event) => {
            submitButtonEvent(event, ID);
        };

        containerIDS(ID);

        let resizeTimeOut;
        const getPosition = () => {
            stepperTabs.forEach(t => {
                if (t.classList.contains('active')) {
                    cancelAnimationFrame(resizeTimeOut);
                    resizeTimeOut = requestAnimationFrame(() => {
                        CONTAINERS.querySelector('.st-tabs-scroll').scroll({
                            left: t.offsetLeft,
                            behavior: 'smooth'
                        });
                    });
                }
            });
        };

        if (indicatorVisible) updateStepper(currentStep);

        const onContainerClick = (event) => {
            const button = event.target.closest('.next-step, .prev-step, .submit-step');
            if (button) {
                if (button.matches('.next-step')) {
                    nextEventListener(event);
                } else if (button.matches('.prev-step')) {
                    prevEventListener(event);
                } else if (button.matches('.submit-step')) {
                    submitEventListener(event);
                }
            }
        };
        CONTAINERS.addEventListener('click', (event) => onContainerClick(event));
        stepperTabs.forEach((tab) => {
            tab.addEventListener('click', stepperEventListener);
        });
    });
};