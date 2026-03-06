const BASE_STEPS = ["Photo", "Details", "Review"]

export function StepProgress({ currentStep }: { currentStep: number }) {
  const progress = currentStep <= 0 ? 0 : (currentStep / (BASE_STEPS.length - 1)) * 100

  return (
    <div className="step-progress" aria-label="Registration progress">
      <div className="step-progress__track" aria-hidden="true">
        <div className="step-progress__fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="step-progress__items">
        {BASE_STEPS.map((step, index) => {
          const state = index < currentStep ? "done" : index === currentStep ? "active" : "upcoming"

          return (
            <div key={step} className="step-progress__item">
              <div className={`step-progress__dot step-progress__dot--${state}`}>
                {index < currentStep ? "✓" : index + 1}
              </div>
              <span className={`step-progress__label step-progress__label--${state}`}>{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
