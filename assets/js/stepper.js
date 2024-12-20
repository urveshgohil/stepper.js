/* Stepper Vanilla JS Library v2.2.12  */
"use strict";
const stepper = (selector, options = {}) => {
    const CONTAINER = document.querySelectorAll(selector);    
    const NUMBER = () => Math.floor(10000 + Math.random() * 90000);
    const ATTRIBUTES = (element, attributes) => Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));    
    const hasClass = (element, className) => element.classList.contains(className);
    const addClass = (element, className) => element.classList.add(className);
    const removeClass = (element, className) => element.classList.remove(className);
    CONTAINER.forEach((CONTAINERS, INDEX) => {
        const AriaHidden = (element, value) => element.setAttribute("aria-hidden", value);
        const DataDisabled = (element, value) => element.setAttribute("data-disabled", value);
        const TabsWrapper = () => `<div class="st-tabs-scroll"><div class="st-tabs-wrapper"></div></div>`;
        const TO = (value, optionalValue) => value ?? optionalValue;
        const IndicatorWrapper = (children) => `<div class="st-indicator-main" role="indicator"><span class="st-indicator-group">${children}</div></div>`;
        const IndicatorClassic = (totalSteps, currentStep) => IndicatorWrapper(`${Array.from({ length: totalSteps }, () => `<span class="st-indicator"></span>`).join('')}</span>
            <span class="st-position-group"><span class="st-position">${currentStep}</span>/<span class="st-total">${totalSteps}</span>`);
        const IndicatorDefault = (totalSteps) => IndicatorWrapper(`${Array.from({ length: totalSteps }, (_, index) => `<span class="st-indicator"><span class="st-number">${index + 1}</span></span>`).join('')}</span>`);
        const stIndicatorMainRemove = () => { if (CONTAINERS.querySelector('.st-indicator-main')) CONTAINERS.querySelector('.st-indicator-main').remove(); }
        stIndicatorMainRemove();
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
        const stIndicators = CONTAINERS.querySelectorAll('.st-indicator .st-number');

        let currentStep = 1;
        const TOTAL_STEPS = stepperTabs.length;

        const containerWidth = TO(options?.containerWidth, 420);
        const indicatorVisible = TO(options?.indicator?.visible, false);
        const indicatorTheme = TO(options?.indicator?.theme, "Classic");
        const nextButtonEvent = TO(options?.nextButtonEvent, undefined);
        const prevButtonEvent = TO(options?.prevButtonEvent, undefined);
        const submitButtonEvent = TO(options?.submitButtonEvent, undefined);
        const tabButtonEvent = TO(options?.tabButtonEvent, undefined);
        const containerId = TO(options?.containerId, undefined);
        const submitted = TO(options?.submitted, false);
        let updateTabsDisabled = options?.allTabsDisabled;
        if (submitted) updateTabsDisabled = false;
        const allTabsDisabled = TO(updateTabsDisabled, true);


        const stThemeClass = ['st-theme-default', 'st-theme-classic']
        CONTAINERS.classList.remove(...stThemeClass)
        addClass(CONTAINERS, `st-theme-${indicatorTheme.toLowerCase()}`);
        if (stIndicators && indicatorTheme === 'Classic') {
            stIndicators.forEach((si) => si.remove());
        }

        const stepperTabsScroll = CONTAINERS.querySelector('.st-tabs-scroll');
        if (!stepperTabsScroll) {
            const stepperTabsGroup = CONTAINERS.querySelector('.st-tabs');
            stepperTabsGroup.insertAdjacentHTML('beforeend', TabsWrapper());
        }
        
        const stepperTabsWrapper = CONTAINERS.querySelector('.st-tabs-wrapper');
        ATTRIBUTES(CONTAINERS, {
            'id': `st-container-${ID}`,
            'data-id': `container-${ID}`,
            'role': `stepper`,
        });
        stepperTabs.forEach((t, i) => {
            t.classList.remove('step-done');
            stepperTabsWrapper.appendChild(t);
            ATTRIBUTES(t, {
                'data-id': `tab-${i + 1}`,
                'role': `tab`,
                'data-disabled': allTabsDisabled === false ? `false` : `true`,
            });
            if (submitted && t.getAttribute('data-disabled') === 'false') {
                addClass(t, 'step-done');
            }
        });
        stepperPanes.forEach((p, i) => {
            ATTRIBUTES(p, {
                'data-id': `pane-${i + 1}`,
                'role': `pane`,
                'aria-hidden': `true`,
            });
        });

        if (indicatorVisible) {
            if (indicatorTheme === 'Default' || indicatorTheme === 'Classic') {
                let INDICATOR_HTML = ``;            
                switch (indicatorTheme) {
                    case "Default":
                        INDICATOR_HTML = IndicatorDefault(TOTAL_STEPS);
                        break;
                    case "Classic":
                        INDICATOR_HTML = IndicatorClassic(TOTAL_STEPS, currentStep);
                        break;
                    default:
                        INDICATOR_HTML = IndicatorClassic(TOTAL_STEPS);
                        break;
                }
                const INDICATOR_ELEMENT = CONTAINERS.querySelector('.st-indicator-main');
                if (INDICATOR_ELEMENT === null) stepperGroup.insertAdjacentHTML('beforebegin', INDICATOR_HTML);
            }

            if (submitted) {
                CONTAINERS.querySelectorAll('.st-indicator').forEach(indicator => {
                    addClass(indicator, 'step-done');
                });
            }
        }

        if (currentStep === 1) {
            stepperTabs.forEach(t => removeClass(t, 'active'));
            stepperPanes.forEach(p => removeClass(p, 'show'));
            addClass(stepperTab, 'active');
            DataDisabled(stepperTab, "false");
            addClass(stepperPane, 'show');
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
            }
        }

        const containerIDS = (id) => {
            if (containerId && typeof containerId === 'function') containerId(id);
        };

        const switchTabAndPane = (step) => {
            currentStep = step;
            const activeTab = CONTAINERS.querySelector('.st-tab.active');
            if (activeTab) removeClass(activeTab, 'active');
            const stepTab = CONTAINERS.querySelector(`[data-id="tab-${step}"]`);
            if (stepTab) addClass(stepTab, 'active');
            AriaHidden(CONTAINERS.querySelector('.st-pane.show'), "true");
            const showPane = CONTAINERS.querySelector('.st-pane.show');
            if (showPane) removeClass(showPane, 'show');
            const stepPane = CONTAINERS.querySelector(`[data-id="pane-${step}"]`);
            if (stepPane) addClass(stepPane, 'show');
            AriaHidden(CONTAINERS.querySelector(`[data-id="pane-${step}"]`), "false");

            if (indicatorVisible) {
                stepperTabs.forEach((t, i) => {
                    if (i < step - 1) {
                        addClass(t, 'step-done');
                        if (indicatorVisible) {
                            const ind = CONTAINERS.querySelector(`.st-indicator:nth-child(${i + 1})`);
                            if (ind) addClass(ind, 'step-done');
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
            }

            if (currentStep === TOTAL_STEPS) {
                AriaHidden(nextStep, "true");
                if (submitStep) {
                    AriaHidden(submitStep, "false");
                }
            } else {
                AriaHidden(nextStep, "false");
                if (submitStep) {
                    AriaHidden(submitStep, "true");
                }
            }
        };

        const updateStepper = (currentStep) => {
            CONTAINERS.querySelectorAll('.st-indicator').forEach((ind, i) => {
                if (i === (currentStep - 1)) {
                    addClass(ind, 'active');
                } else {
                    removeClass(ind, 'active');
                }
            });
            if (CONTAINERS.querySelector('.st-position')) CONTAINERS.querySelector('.st-position').innerText = currentStep;
        };

        const stepperEventListener = (event) => {
            const currentTab = event.currentTarget;
            if (!hasClass(currentTab, 'active')) {
                if (tabButtonEvent && typeof tabButtonEvent === 'function') tabButtonEvent(event, ID);
                const clickedStep = parseInt(currentTab.dataset.id.split('-')[1]);
                switchTabAndPane(clickedStep);
                DataDisabled(submitStep, false);
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
                    nextButtonEvent(event, {
                        currentStep,
                        nextButtonProcess,
                        id: ID
                    });
                }
            }
        };

        const prevEventListener = (event) => {
            if (currentStep > 1) {
                currentStep--;
                switchTabAndPane(currentStep);
            }
            if (prevButtonEvent && typeof prevButtonEvent === 'function') {
                prevButtonEvent(event, ID);
                DataDisabled(submitStep, false);
            }
        };

        const submitEventListener = (event) => {
            const stepperTabLast = CONTAINERS.querySelector('.st-tab:last-child');
            if (!hasClass(stepperTabLast, 'step-done')) {
                addClass(stepperTabLast, `step-done`);
                const INDICATOR_ELEMENT = CONTAINERS.querySelector('.st-indicator-main');                
                if (INDICATOR_ELEMENT) {
                    const stIndicatorLast = CONTAINERS.querySelector('.st-indicator:last-child');
                    addClass(stIndicatorLast, `step-done`);
                }
            }
            DataDisabled(submitStep, true);
            submitButtonEvent(event, ID);
        };

        containerIDS(ID);

        let resizeTimeOut;
        const getPosition = () => {
            stepperTabs.forEach(t => {
                if (hasClass(t, 'active')) {
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