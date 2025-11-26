import React from 'react';
import { checkSingleQuestion } from '../utils/quizLogic';
import correctLogo from "../images/correct-logo.png";
import wrongLogo from "../images/wrong-logo.png";
import hintLogo from "../images/hint-logo.png";

export default function QuestionCard({ 
    questionData, 
    questionIndex, 
    selectedAnswers,
    onSelect,
    isDisabled,
    theme,
    hintText,
    aiHint,
    isHintVisible 
}) {

    
    const renderConsolidatedFeedback = () => {
        if (!isDisabled) return null;

        const isCorrectOverall = checkSingleQuestion(questionData, selectedAnswers);
        const baseClasses = `mt-6 p-5 rounded-lg border-2`;

        if (isCorrectOverall) {
            return (
                <div className={`
                    ${baseClasses}
                    bg-[var(--green-secondary)]
                    border-[var(--green-primary)]
                    text-[var(--green-primary)]
                `}>
                    <p className="font-bold flex items-center mb-2">
                        <img 
                        src={correctLogo}
                        alt="correct"
                        className="w-7 h-7 mr-2"
                        />
                        <span className="text-lg">Benar! Kerja Bagus!</span>
                    </p>
                    <p className="text-sm leading-relaxed ml-9 text-[var(--text-primary)]">
                        {questionData.feedback}
                    </p>
                </div>
            );
        }

        return (
            <div className={`
                ${baseClasses}
                bg-[var(--red-secondary)]
                border-[var(--red-primary)]
                text-[var(--red-primary)]
            `}>
                <p className="font-bold flex items-center mb-2">
                   <img 
                        src={wrongLogo}
                        alt="wrong"
                        className="w-7 h-7 mr-2"
                    />
                    <span className="text-lg">Salah! Coba Lagi!</span>
                </p>

                <p className="text-sm leading-relaxed mb-4 ml-9 text-[var(--text-primary)]">
                    {questionData.feedback}
                </p>

                {/* HINT YANG DI FEEDBACK SALAH */}
                {aiHint && (
                <div className={`
                    mt-3 p-4 rounded-lg border-2 ml-9
                    bg-[var(--yellow-secondary)]
                    border-[var(--yellow-primary)]
                    text-[var(--yellow-primary)]
                `}>
                    <p className="font-bold flex items-center mb-2">
                        <img
                            src={hintLogo}
                            alt="Hint Logo"
                            className="w-6 h-6 mr-2"
                        />
                        <span>Petunjuk</span>
                    </p>
                    <p className="text-sm leading-relaxed ml-8 text-[var(--text-primary)]">
                        {aiHint}
                    </p>
                </div>
                )}
                
            </div>
        );
    };

    return (
        <div className={`
            p-6 shadow-sm 
            bg-[var(--bg-secondary)] 
            border border-[var(--text-primary)]/20
        `}>

            <p className={`text-xl font-medium mb-6 text-[var(--text-primary)]`}>
                {questionIndex}. {questionData.question}
            </p>

            <div className="space-y-3">
                {questionData.options.map((option) => {
                    const isSelected = selectedAnswers.includes(option.id);
                    let optionStyles = `
                        border-2
                        text-[var(--text-primary)]
                        ${!isDisabled ? "hover:bg-[var(--bg-primary)]/10" : ""}
                    `;

                    if (isDisabled) {
                        if (option.is_correct) {
                            optionStyles += `
                                bg-[var(--green-secondary)]
                                border-[var(--green-primary)]
                                text-[var(--green-primary)]
                            `;
                        } else if (isSelected && !option.is_correct) {
                            optionStyles += `
                                bg-[var(--red-secondary)]
                                border-[var(--red-primary)]
                                text-[var(--red-primary)]
                            `;
                        }
                    }

                    return (
                        <label
                            key={option.id}
                            className={`flex items-start p-4 rounded-lg transition-all cursor-pointer ${optionStyles}`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={() => onSelect(questionData.id, option.id)}
                                className="mt-0.5 mr-3 h-5 w-5 rounded border-gray-300 
                                text-[var(--blue-primary)] focus:ring-[var(--blue-primary)]"
                            />
                            <span className="flex-1 leading-relaxed">
                                {option.text}
                            </span>

                            
                        </label>
                    );
                })}
            </div>

            {renderConsolidatedFeedback()}

            {isHintVisible && hintText && (
                <div className="
                    mt-6 p-5 rounded-lg border-2
                    bg-[var(--yellow-secondary)]
                    border-[var(--yellow-primary)]
                    text-[var(--yellow-primary)]
                ">
                    <p className="font-bold flex items-center mb-2">
                        <img
                            src={hintLogo}
                            alt="Hint Logo"
                            className="w-6 h-6 mr-2"
                        />
                        <span>Petunjuk</span>
                    </p>
                    <p className="text-sm leading-relaxed ml-8 text-[var(--text-primary)]">{hintText}</p>
                </div>
            )}
        </div>
    );
}
