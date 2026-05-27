
import React from 'react';
import { motion } from 'motion/react';
import { Step, STEPS } from '../types';

interface StepIndicatorProps {
  currentStep: Step;
  route: 'A' | 'B';
}

const STEP_LABELS: Record<Step, string> = {
  BASIC: 'はじめに',
  SUBMITTER: '申請・シリーズ',
  DETAILS: '登壇者・詳細',
  ASSETS: 'イベント情報データ',
  POLICIES: '注意及び確認事項',
  CONFIRM: '確認'
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, route }) => {
  const visibleSteps = STEPS.filter(step => {
    if (route === 'A' && step === 'POLICIES') return false;
    return true;
  });

  const currentIndex = visibleSteps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-16 px-2 md:px-4">
      {visibleSteps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = step === currentStep;
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative group">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isCurrent ? '#2563eb' : isActive ? '#dbeafe' : '#ffffff',
                  borderColor: isActive ? '#2563eb' : '#cbd5e1',
                  scale: isCurrent ? 1.15 : 1,
                  color: isCurrent ? '#ffffff' : isActive ? '#2563eb' : '#94a3b8',
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-2 z-10 shadow-sm"
              >
                <span className="text-xs md:text-sm font-bold">{index + 1}</span>
              </motion.div>
              
              <motion.span 
                initial={false}
                animate={{
                  color: isCurrent ? '#2563eb' : '#64748b',
                  fontWeight: isCurrent ? 700 : 500,
                  y: isCurrent ? 4 : 0,
                }}
                className="absolute -bottom-8 text-[10px] md:text-xs whitespace-nowrap"
              >
                {STEP_LABELS[step]}
              </motion.span>
            </div>
            
            {index < visibleSteps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 md:mx-2 bg-slate-200 relative overflow-hidden">
                <motion.div 
                  initial={false}
                  animate={{
                    width: index < currentIndex ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full bg-blue-600"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
