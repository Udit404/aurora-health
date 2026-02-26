/* 
This file is used for Rapid Craft ui only, and is not useful in project
*/

import React, { useEffect, useRef, useState } from 'react';

const WithAttributeWrapper = (WrappedComponent) => {
    return (props) => {
        const [overlayData, setOverlayData] = useState(null);
        const currentBorderedElement = useRef(null);

        const isTextElement = (t) => {
            if (
                t.nodeType === Node.ELEMENT_NODE &&
                t.childNodes.length === 1 &&
                t.childNodes[0].nodeType === Node.TEXT_NODE
            ) {
                return true;
            }
            return false;
        };

        useEffect(() => {
            const handleEvent = (event) => {
                if (event.target.closest('[data-button-group]')) {
                    return;
                }
                const target = event.target;
                let isText = isTextElement(target);
                let currentElement = target;
                let inspPath = currentElement.getAttribute('data-insp-path-rc');
                while (!inspPath && currentElement.parentElement) {
                    currentElement = currentElement.parentElement;
                    inspPath = currentElement.getAttribute('data-insp-path-rc');
                }
                const innerHTML = target.innerHTML; // Get innerHTML of the target element
                window.parent.postMessage(
                    {
                        inspPath: inspPath,
                        type: 'rc',
                        componentType: isText ? 'Text' : 'Component',
                        innerHTML: innerHTML, // Include innerHTML in the message
                    },
                    '*'
                );

                if (currentBorderedElement.current) {
                    currentBorderedElement.current.style.border = ''; // Remove border from the previous element
                }

                target.style.border = '2px solid #0089eb';
                target.style.borderRadius = '6px'; // Add border to the target element
                currentBorderedElement.current = target;

                const { top, left, width, height } =
                    target.getBoundingClientRect();
                setOverlayData({
                    top,
                    left,
                    width,
                    height,
                    isText,
                });
            };

            const repositionOverlay = () => {
                if (currentBorderedElement.current) {
                    const { top, left, width, height } =
                        currentBorderedElement.current.getBoundingClientRect();
                    setOverlayData((prev) => ({
                        ...prev,
                        top,
                        left,
                        width,
                        height,
                    }));
                }
            };

            const handleMessage = (event) => {
                if (event.data && event.data.type === 'rc') {
                    if (event.data.action === 'openSelect') {
                        document.addEventListener('click', handleEvent);
                        document.addEventListener('keypress', handleEvent);
                    } else if (event.data.action === 'closeSelect') {
                        document.removeEventListener('click', handleEvent);
                        document.removeEventListener('keypress', handleEvent);
                        if (currentBorderedElement.current) {
                            currentBorderedElement.current.style.border = '';
                            currentBorderedElement.current = null;
                        }
                        setOverlayData(null);
                    }
                }
            };

            window.addEventListener('message', handleMessage);
            window.addEventListener('scroll', repositionOverlay);
            window.addEventListener('resize', repositionOverlay);

            return () => {
                document.removeEventListener('click', handleEvent);
                document.removeEventListener('keypress', handleEvent);
                window.removeEventListener('message', handleMessage);
                window.removeEventListener('scroll', repositionOverlay);
                window.removeEventListener('resize', repositionOverlay);
            };
        }, []);

        return (
            <>
                <WrappedComponent {...props} />
                {overlayData && (
                    <div
                        style={{
                            position: 'absolute',
                            top: overlayData.top,
                            left: overlayData.left,
                            width: overlayData.width,
                            height: overlayData.height,
                            backgroundColor: 'rgba(0, 137, 235, 0.24)',
                            zIndex: 9999,
                            pointerEvents: 'none',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '8px',
                                fontSize: '10px',
                                backgroundColor: '#0089eb',
                                color: '#fff',
                                borderRadius: '8px 8px 0 0',
                                padding: '4px',
                                height: '22px',
                                width: '88px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {overlayData.isText ? (
                                <span className="Appkit4-icon icon-text-outline"></span>
                            ) : (
                                <span className="Appkit4-icon icon-vector-outline"></span>
                            )}
                            {overlayData.isText ? 'Text' : 'Component'}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '8px',
                                width: '112px',
                                height: '40px',
                                marginTop: '4px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '4px',
                                position: 'absolute',
                                left: 'calc(50% - 112px/2 + 54.5px)',
                                boxShadow:
                                    '0px 8px 16px -2px rgba(71, 71, 71, 0.24)',
                                zIndex: 10000,
                                pointerEvents: 'auto',
                            }}
                            data-button-group="true"
                        >
                            {[
                                'icon-lightbulb-outline',
                                'icon-query-outline',
                                'icon-delete-outline',
                            ].map((icon) => (
                                <div
                                    key={icon}
                                    style={{
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        lineHeight: '32px',
                                        width: '32px',
                                        height: '32px',
                                        cursor: 'pointer',
                                        color:
                                            icon === 'icon-lightbulb-outline'
                                                ? '#B93954'
                                                : undefined,
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        window.parent.postMessage(
                                            {
                                                command: icon,
                                                type: 'rc-command',
                                            },
                                            '*'
                                        );
                                    }}
                                >
                                    <span
                                        className={`Appkit4-icon ${icon}`}
                                    ></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    };
};

export default WithAttributeWrapper;
