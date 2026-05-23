import { useState } from 'react';
import { MdCheckCircle, MdLock, MdRadioButtonUnchecked, MdExpandMore, MdChevronRight, MdSchool, MdTimeline } from 'react-icons/md';
import FieldIcon from './FieldIcon';

const levelColors = {
  beginner: 'from-green-400 to-emerald-500',
  intermediate: 'from-yellow-400 to-orange-500',
  advanced: 'from-red-400 to-rose-500'
};

const levelBadgeColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
};

function RoadmapTree({ steps = [], progress = [], isLocked = false }) {
  const [expandedStep, setExpandedStep] = useState(null);

  const getStepStatus = (stepIndex) => {
    if (isLocked) return 'locked';
    const step = steps[stepIndex];
    if (!step) return 'locked';
    if (stepIndex === 0) return 'unlocked';
    const prevStep = steps[stepIndex - 1];
    if (!prevStep) return 'unlocked';
    const prevCompleted = progress.some(
      p => p.title === prevStep.title && p.completed
    );
    return prevCompleted || stepIndex === 0 ? 'unlocked' : 'locked';
  };

  const getIcon = (status) => {
    switch (status) {
      case 'completed': return <MdCheckCircle className="text-green-500 text-lg" />;
      case 'unlocked': return <MdRadioButtonUnchecked className="text-blue-500 text-lg" />;
      default: return <MdLock className="text-gray-500 text-lg" />;
    }
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isExpanded = expandedStep === index;
          const completed = progress.some(p => p.title === step.title && p.completed);
          const actualStatus = completed ? 'completed' : status;

          return (
            <div key={index} className="relative group">
              {/* Connector line */}
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer"
                onClick={() => setExpandedStep(isExpanded ? null : index)}
              >
                {/* Step circle */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  actualStatus === 'completed'
                    ? 'bg-green-500 shadow-lg shadow-green-500/30'
                    : actualStatus === 'unlocked'
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                    : 'bg-gray-600'
                }`}>
                  {actualStatus === 'completed' ? (
                    <MdCheckCircle className="text-white text-xl" />
                  ) : actualStatus === 'locked' ? (
                    <MdLock className="text-gray-400 text-lg" />
                  ) : (
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-semibold text-sm ${
                      actualStatus === 'completed'
                        ? 'text-green-500 line-through'
                        : actualStatus === 'locked'
                        ? 'text-gray-500'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      <FieldIcon name={step.icon} className="inline mr-1 text-sm" /> {step.title}
                    </h4>
                    {step.level && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${levelBadgeColors[step.level] || levelBadgeColors.beginner}`}>
                        {step.level}
                      </span>
                    )}
                    {step.duration && (
                      <span className="text-[10px] text-gray-400">{step.duration}</span>
                    )}
                  </div>

                  {step.description && (
                    <p className={`text-xs mt-0.5 ${
                      actualStatus === 'locked' ? 'text-gray-500' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  )}

                  {step.skills && step.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {step.skills.map((skill, i) => (
                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${
                          actualStatus === 'locked'
                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expand/collapse */}
                {step.technologies?.length > 0 && (
                  <div className="shrink-0 text-gray-400">
                    {isExpanded ? <MdExpandMore /> : <MdChevronRight />}
                  </div>
                )}
              </div>

              {/* Expanded details */}
              {isExpanded && step.technologies?.length > 0 && (
                <div className="ml-14 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  {step.technologies?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Technologies</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.technologies.map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {step.projects?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Projects</p>
                      {step.projects.map((proj, i) => (
                        <p key={i} className="text-xs text-gray-600 dark:text-gray-400">• {proj.title}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isLocked && (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
          <div className="text-center p-6">
            <MdLock className="text-4xl text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Complete your current course to unlock this roadmap</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SubFieldCard({ subField, isLocked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
        isLocked
          ? 'opacity-50 border-gray-200 dark:border-gray-700'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5'
      } bg-white dark:bg-gray-800`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
          <MdLock className="text-2xl text-gray-400" />
        </div>
      )}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 bg-gradient-to-br ${subField.color || 'from-blue-400 to-blue-600'} bg-opacity-20`}>
        <FieldIcon name={subField.icon} className="text-xl" />
      </div>
      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{subField.name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{subField.description}</p>
      {subField.duration && (
        <span className="text-[10px] text-gray-400">{subField.duration}</span>
      )}
    </div>
  );
}

function CareerPathCard({ path }) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{path.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{path.description}</p>
      <div className="flex items-center gap-3 text-xs">
        {path.salary && <span className="text-green-600 dark:text-green-400 font-medium">{path.salary}</span>}
        {path.demand && (
          <span className={`px-2 py-0.5 rounded-full ${
            path.demand === 'very-high' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
            path.demand === 'high' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {path.demand.replace('-', ' ')}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {path.roles?.slice(0, 3).map((role, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}

export { RoadmapTree, SubFieldCard, CareerPathCard };
export default RoadmapTree;
