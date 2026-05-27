
import React, { useState } from 'react';
import { Step, SubmissionData, STEPS } from './types';
import { StepIndicator } from './components/StepIndicator';
import { 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  CheckCircle2,
  Upload, 
  FileText, 
  ExternalLink,
  AlertCircle,
  Plus,
  Trash2,
  UserPlus,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const IS_TEST_MODE = false; // テスト用にバリデーションを無効化する場合は true

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('BASIC');
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState<SubmissionData>({
    appType: 'new',
    contentType: '▼選択してください▼',
    desiredServices: [],
    releaseScope: 'general',
    department: '',
    departmentRole: '主催',
    otherDepartmentName: '',
    contactName: '',
    contactEmail: '',
    deanApproval: false,
    approverName: '',
    approverTitle: '',
    eventName: '',
    eventDateTime: '',
    eventLocation: '',
    eventDescription: '',
    contents: [
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        speakers: [
          {
            id: (Date.now() + 1).toString(),
            name: '',
            affiliation: '',
            title: '',
            email: '',
            profile: ''
          }
        ]
      }
    ],
    eventUrl: '',
    flyer: '',
    logo: '提出しない（部局のロゴがない等)',
    thumbnail: '提出',
    youtubeUrl: '',
    youtubeCopyrightConfirm: false,
    notes: '',
    materialCopyrightConfirm: false,
    fourWeekConsent: false,
    speakerInstructionConfirm: false,
    hasQA: false,
    hasInterpretation: false,
    qaParticipantConsent: undefined,
    qaMethod: undefined,
    interpreterConsentRadio: undefined,
    copyrightConfirm: false,
    qaPublication: 'なし',
    interpretation: false,
    interpreterConsent: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileNames, setFileNames] = useState({
    flyer: '',
    logo: '',
    thumbnail: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof fileNames) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileNames(prev => ({ ...prev, [field]: file.name }));
      setData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const getRoute = () => {
    const services = data.desiredServices || [];
    const isB = services.some(s => ['撮影', '著作権処理', '映像編集'].includes(s));
    return isB ? 'B' : 'A';
  };

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    
    // Validation
    if (!IS_TEST_MODE) {
      if (currentStep === 'BASIC') {
        if (data.desiredServices.length === 0) {
          alert('ご希望内容を1つ以上選択してください。');
          return;
        }
      }

      if (currentStep === 'SUBMITTER') {
        if (data.departmentRole === '共催 その他' && !data.otherDepartmentName?.trim()) {
          alert('主催部局を入力してください。');
          return;
        }
        if (!data.deanApproval) {
          alert('部局長の承認確認が必要です。');
          return;
        }
      }

      if (currentStep === 'DETAILS') {
        for (const content of data.contents) {
          if (!content.title.trim()) {
            alert('すべてのコンテンツタイトルを入力してください。');
            return;
          }
          for (const speaker of content.speakers) {
            if (!speaker.name.trim() || !speaker.email.trim()) {
              alert('すべての登壇者の氏名とメールアドレスを入力してください。');
              return;
            }
          }
        }
      }

      if (currentStep === 'ASSETS') {
        if (route === 'A' && !data.youtubeCopyrightConfirm) {
          alert('YouTube動画の権利処理・編集済みであることの確認が必要です。');
          return;
        }
      }

      if (currentStep === 'POLICIES') {
        if (!data.materialCopyrightConfirm || !data.fourWeekConsent || !data.speakerInstructionConfirm) {
          alert('必須の確認事項にチェックを入れてください。');
          return;
        }
        if (data.hasQA) {
          if (!data.qaParticipantConsent) {
            alert('参加者の顔・声の公開について選択してください。');
            return;
          }
          if (!data.qaMethod) {
            alert('質疑応答部分の公開方法について選択してください。');
            return;
          }
        }
        if (data.hasInterpretation) {
          if (!data.interpreterConsentRadio) {
            alert('同時通訳・手話通訳の同意について選択してください。');
            return;
          }
        }
      }
    }

    if (currentIndex < STEPS.length - 1) {
      let nextStepIndex = currentIndex + 1;
      
      // Route A jumps over POLICIES to CONFIRM
      if (route === 'A' && STEPS[nextStepIndex] === 'POLICIES') {
        nextStepIndex = STEPS.indexOf('CONFIRM');
      }
      
      const nextStepName = STEPS[nextStepIndex];
      console.log('Next Step:', nextStepName, 'Route:', route);
      if (nextStepName) {
        setCurrentStep(nextStepName);
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          console.error('Scroll error:', e);
          window.scrollTo(0, 0);
        }
      }
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      let prevStepIndex = currentIndex - 1;

      // Route A jumps back over POLICIES from CONFIRM
      if (route === 'A' && STEPS[prevStepIndex] === 'POLICIES') {
        prevStepIndex = STEPS.indexOf('ASSETS');
      }

      const prevStepName = STEPS[prevStepIndex];
      if (prevStepName) {
        setCurrentStep(prevStepName);
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          console.error('Scroll error:', e);
          window.scrollTo(0, 0);
        }
      }
    }
  };

  const jumpToStep = (step: Step) => {
    setIsEditMode(true);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ReviewItem = ({ label, value, step }: { label: string; value: React.ReactNode; step: Step }) => (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-4 border-b border-gray-50 group">
      <div className="w-full sm:w-1/3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="w-full sm:w-2/3 flex items-start justify-between gap-4 mt-1 sm:mt-0">
        <div className="text-slate-700 font-medium break-words leading-relaxed">{value || <span className="text-slate-300 italic">未入力</span>}</div>
        <button 
          type="button" 
          onClick={() => jumpToStep(step)}
          className="text-blue-600 hover:text-blue-700 text-xs font-bold md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1"
        >
          <Pencil size={12} />
          <span>編集</span>
        </button>
      </div>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'desiredServices') {
        setData(prev => {
          let services: string[];
          if (value === '完成動画の公開のみ') {
            services = checked ? ['完成動画の公開のみ'] : [];
          } else {
            services = checked 
              ? [...prev.desiredServices.filter(s => s !== '完成動画の公開のみ'), value]
              : prev.desiredServices.filter(s => s !== value);
          }
          return { ...prev, desiredServices: services };
        });
      } else {
        setData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setData(prev => {
        const newData = { ...prev, [name]: value };
        if (name === 'departmentRole' && value === '主催') {
          newData.otherDepartmentName = '';
        }
        return newData;
      });
    }
  };

  const addContent = () => {
    // Validation: Prevent adding if the last content item has empty required fields
    if (!IS_TEST_MODE) {
      const lastContent = data.contents[data.contents.length - 1];
      if (lastContent && (!lastContent.title.trim() || !lastContent.description.trim())) {
        return; // Optionally add visual feedback here
      }
    }

    setData(prev => ({
      ...prev,
      contents: [
        ...prev.contents,
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          speakers: [
            {
              id: (Date.now() + 1).toString(),
              name: '',
              affiliation: '',
              title: '',
              email: '',
              profile: ''
            }
          ]
        }
      ]
    }));
  };

  const removeContent = (id: string) => {
    if (data.contents.length <= 1) return;
    setData(prev => ({
      ...prev,
      contents: prev.contents.filter(c => c.id !== id)
    }));
  };

  const updateContent = (id: string, field: 'title' | 'description', value: string) => {
    setData(prev => ({
      ...prev,
      contents: prev.contents.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const addSpeaker = (contentId: string) => {
    // Validation: Prevent adding if the last speaker in this content has empty required fields
    if (!IS_TEST_MODE) {
      const content = data.contents.find(c => c.id === contentId);
      if (content) {
        const lastSpeaker = content.speakers[content.speakers.length - 1];
        if (lastSpeaker && (!lastSpeaker.name.trim() || !lastSpeaker.email.trim())) {
          return;
        }
      }
    }

    setData(prev => ({
      ...prev,
      contents: prev.contents.map(c => 
        c.id === contentId 
          ? { 
              ...c, 
              speakers: [
                ...c.speakers, 
                { id: Date.now().toString(), name: '', affiliation: '', title: '', email: '', profile: '' }
              ] 
            } 
          : c
      )
    }));
  };

  const removeSpeaker = (contentId: string, speakerId: string) => {
    setData(prev => ({
      ...prev,
      contents: prev.contents.map(c => 
        c.id === contentId 
          ? { ...c, speakers: c.speakers.filter(s => s.id !== speakerId) } 
          : c
      )
    }));
  };

  const updateSpeaker = (contentId: string, speakerId: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      contents: prev.contents.map(c => 
        c.id === contentId 
          ? { 
              ...c, 
              speakers: c.speakers.map(s => s.id === speakerId ? { ...s, [field]: value } : s) 
            } 
          : c
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const RequiredBadge = () => <span className="text-red-500 ml-1 font-bold text-xs" title="必須">*</span>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100 p-8 md:p-16 text-center space-y-8"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={48} strokeWidth={3} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">申請が完了しました</h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            ご入力いただいた内容で申請を受け付けました。<br />
            担当者より追ってご連絡いたします。
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            トップに戻る
          </button>
        </motion.div>
      </div>
    );
  }

  const route = getRoute();
  console.log('Current Step in Render:', currentStep);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full mb-6">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
          <span className="text-blue-700 text-[10px] font-bold tracking-widest">UTokyo Channel</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          UTokyo Channel 公開申請(コンテンツ登録)
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-light">
          学術資産を世界へ。
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <StepIndicator currentStep={currentStep} route={route} />

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 lg:p-14">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Selection (Section I) */}
              {currentStep === 'BASIC' && (
                <motion.div 
                  key="BASIC"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="border-l-4 border-blue-600 pl-5">
                    <h2 className="text-2xl font-bold text-slate-800">はじめに</h2>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-700 mb-2">
                    本フォームは、公開に向けた詳細情報の登録を行うものです。
                  </p>
                  <ul className="text-slate-600 text-sm list-disc list-inside leading-relaxed">
                    <li>未確定の項目については、わかる範囲でご入力ください。</li>
                    <li>申請後に事務局より詳細をご案内いたします。</li>
                    <li><RequiredBadge />は必須項目となります。</li>
                  </ul>
                </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-4">申請種別 <RequiredBadge /></label>
                      <div className="flex gap-4">
                        {(['new', 'add'] as const).map(type => (
                          <label key={type} className={`choice-card flex-1 ${data.appType === type ? 'active' : ''}`}>
                            <input type="radio" name="appType" value={type} checked={data.appType === type} onChange={handleInputChange} className="sr-only" />
                            <span className="font-bold text-sm">{type === 'new' ? '新規' : '追加'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center">コンテンツ種別 <RequiredBadge /></label>
                      <div className="relative">
                        <select name="contentType" value={data.contentType} onChange={handleInputChange} className="input-field appearance-none bg-white pr-10">
                          {['▼選択してください▼', '正規授業', 'インタビュー', 'オープンキャンパス', '講演会', 'シンポジウム', 'セミナー', '体験イベント', '対談', 'トークイベント', 'フォーラム', 'ミニレクチャ', 'ワークショップ', '学内向け研修・ガイダンス', '公開講座', 'その他'].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-4">ご希望内容 <RequiredBadge /></label>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <label className={`choice-card ${data.desiredServices.includes('完成動画の公開のみ') ? 'active' : ''}`}>
                            <input type="checkbox" name="desiredServices" value="完成動画の公開のみ" checked={data.desiredServices.includes('完成動画の公開のみ')} onChange={handleInputChange} className="sr-only" />
                            <span className="font-bold text-sm">完成動画の公開のみ</span>
                          </label>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">複数選択可</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {['撮影', '著作権処理', '映像編集'].map(service => (
                              <label key={service} className={`choice-card ${data.desiredServices.includes(service) ? 'active' : ''}`}>
                                <input type="checkbox" name="desiredServices" value={service} checked={data.desiredServices.includes(service)} onChange={handleInputChange} className="sr-only" />
                                <span className="font-bold text-sm">{service}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 block mb-4">公開範囲 <RequiredBadge /></label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {([
                          { id: 'general', label: '一般公開', desc: 'YouTube等外部配信含む' },
                          { id: 'campus', label: '学内限定公開', desc: '視聴にはUTokyo Accountが必要' }
                        ] as const).map(scope => (
                          <label key={scope.id} className={`choice-card flex-1 ${data.releaseScope === scope.id ? 'active' : ''}`}>
                            <input type="radio" name="releaseScope" value={scope.id} checked={data.releaseScope === scope.id} onChange={() => setData(prev => ({ ...prev, releaseScope: scope.id }))} className="sr-only" />
                            <span className="font-bold text-sm block">{scope.label}</span>
                            <span className="text-[10px] opacity-70 leading-tight mt-1">{scope.desc}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3 text-blue-800 border border-blue-100">
                      <div className="mt-0.5 shrink-0"><Info size={16} /></div>
                      <p className="text-xs leading-relaxed">
                        公開動画にはUTokyo Channelのウォーターマーク及びオープニングとエンディングにCGが入ります。
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Submitter & Event Info */}
              {currentStep === 'SUBMITTER' && (
                <motion.div 
                  key="SUBMITTER"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="border-l-4 border-blue-600 pl-5">
                    <h2 className="text-2xl font-bold text-slate-800">申請者・シリーズ情報</h2>
                    <p className="text-slate-500 text-sm">部局情報とシリーズの基本情報を入力してください。</p>
                    <p className="text-slate-500 text-sm">UTokyo Channelでは、講義や講演ごとの動画ページを「コンテンツ」、それらを授業単位やテーマごとにまとめたページを「シリーズ」として扱います。</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                        申請者情報
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center">申請部局 <RequiredBadge /></label>
                           <p className="text-slate-500 text-sm">正式名書で記載してください。</p>
                          <input required={!IS_TEST_MODE} name="department" value={data.department} onChange={handleInputChange} className="input-field" placeholder="例：教養学部" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center">申請者区分 <RequiredBadge /></label>
                          <div className="flex gap-4">
                            {(['主催', '共催 その他'] as const).map(role => (
                              <label key={role} className={`choice-card flex-1 py-2 ${data.departmentRole === role ? 'active' : ''}`}>
                                <input type="radio" name="departmentRole" value={role} checked={data.departmentRole === role} onChange={handleInputChange} className="sr-only" />
                                <span className="font-bold text-sm">{role}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <AnimatePresence>
                          {data.departmentRole === '共催 その他' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 overflow-hidden"
                            >
                              <label className="text-xs font-bold text-slate-600 flex items-center">主催部局をご記入ください <RequiredBadge /></label>
                              <input required={!IS_TEST_MODE} name="otherDepartmentName" value={data.otherDepartmentName} onChange={handleInputChange} className="input-field py-2.5" placeholder="部局名" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center">担当者名 <RequiredBadge /></label>
                        <input required={!IS_TEST_MODE} name="contactName" value={data.contactName} onChange={handleInputChange} className="input-field" placeholder="東京 太郎" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center">担当者メールアドレス <RequiredBadge /></label>
                        <input required={!IS_TEST_MODE} type="email" name="contactEmail" value={data.contactEmail} onChange={handleInputChange} className="input-field" placeholder="example@g.ecc.u-tokyo.ac.jp" />
                      </div>
                      <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 transition-all">
                          <label className="flex items-start space-x-3 cursor-pointer group">
                            <div className="relative flex items-center h-5 mt-0.5">
                              <input 
                                type="checkbox" 
                                name="deanApproval" 
                                checked={data.deanApproval} 
                                onChange={handleInputChange} 
                                className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer transition-colors" 
                              />
                            </div>
                            <span className="text-xs font-bold text-amber-900 leading-relaxed group-hover:text-amber-700 transition-colors">
                              公開申請について、部局長の承認を得ています。 <RequiredBadge />
                            </span>
                          </label>

                          <AnimatePresence>
                            {data.deanApproval && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-4 pt-4 border-t border-amber-200">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">役職 <RequiredBadge /></label>
                                    <input 
                                      required={!IS_TEST_MODE} 
                                      name="approverTitle" 
                                      value={data.approverTitle} 
                                      onChange={handleInputChange} 
                                      className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-300" 
                                      placeholder="例：学部長" 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">承認者氏名 <RequiredBadge /></label>
                                    <input 
                                      required={!IS_TEST_MODE} 
                                      name="approverName" 
                                      value={data.approverName} 
                                      onChange={handleInputChange} 
                                      className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-300" 
                                      placeholder="姓名" 
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-6 md:p-8 rounded-3xl border border-indigo-100 space-y-6">
                      <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                        <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                        シリーズ情報
                      </h3>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center">シリーズ名 <RequiredBadge /></label>
                        <input required={!IS_TEST_MODE} name="eventName" value={data.eventName} onChange={handleInputChange} className="input-field bg-white" placeholder="例：東京大学 公開講座 2024" />
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center">開催日時 <RequiredBadge /></label>
                          <input required={!IS_TEST_MODE} name="eventDateTime" value={data.eventDateTime} onChange={handleInputChange} className="input-field bg-white" placeholder="例：2024年10月1日 14:00〜" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center">開催場所 <RequiredBadge /></label>
                          <input required={!IS_TEST_MODE} name="eventLocation" value={data.eventLocation} onChange={handleInputChange} className="input-field bg-white" placeholder="例：安田講堂" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center">シリーズ概要文 <RequiredBadge /></label>
                        <textarea required={!IS_TEST_MODE} name="eventDescription" value={data.eventDescription} onChange={handleInputChange} rows={4} className="input-field bg-white resize-none" placeholder="シリーズの趣旨や内容を簡潔に記載してください。公開サイトには冒頭の120文字程度が表示されます。" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Content & Speaker Details */}
              {currentStep === 'DETAILS' && (
                <motion.div 
                  key="DETAILS"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="border-l-4 border-blue-600 pl-5">
                    <h2 className="text-2xl font-bold text-slate-800">登壇者・コンテンツ詳細</h2>
                    <p className="text-slate-500 text-sm">公開する動画と登壇者の詳細情報を入力してください。</p>
                  </div>

                  <div className="space-y-10">
                    {data.contents.map((content, cIdx) => (
                      <motion.div 
                        key={content.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-6 md:p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-8"
                      >
                        {data.contents.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeContent(content.id)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            title="コンテンツを削除"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}

                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100">
                              {cIdx + 1}
                            </span>
                            <h3 className="text-xl font-bold text-slate-800">コンテンツタイトル</h3>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 flex items-center">タイトル名 <RequiredBadge /></label>
                              <input 
                                required={!IS_TEST_MODE} 
                                value={content.title} 
                                onChange={(e) => updateContent(content.id, 'title', e.target.value)} 
                                className="input-field" 
                                placeholder="例：第1講「現代物理学の展望」" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 flex items-center">概要文 <RequiredBadge /></label>
                              <textarea 
                                required={!IS_TEST_MODE} 
                                value={content.description} 
                                onChange={(e) => updateContent(content.id, 'description', e.target.value)} 
                                rows={3} 
                                className="input-field resize-none" 
                                placeholder="動画の内容を完結に記載してください。文字制限はありません。" 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-50">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-bold text-slate-700 flex items-center">
                              <UserPlus size={18} className="mr-2 text-blue-500" />
                              登壇者情報
                            </h4>
                          </div>

                          <div className="space-y-4">
                            {content.speakers.map((speaker, sIdx) => (
                              <motion.div 
                                key={speaker.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group relative p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                              >
                                {content.speakers.length > 1 && (
                                  <button 
                                    type="button"
                                    onClick={() => removeSpeaker(content.id, speaker.id)}
                                    className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                    title="登壇者を削除"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">氏名 (姓名) <RequiredBadge /></label>
                                    <input 
                                      required={!IS_TEST_MODE} 
                                      value={speaker.name} 
                                      onChange={(e) => updateSpeaker(content.id, speaker.id, 'name', e.target.value)} 
                                      className="input-field bg-white py-2 text-sm" 
                                      placeholder="東大 一郎" 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">所属 <RequiredBadge /></label>
                                    <input 
                                      required={!IS_TEST_MODE} 
                                      value={speaker.affiliation} 
                                      onChange={(e) => updateSpeaker(content.id, speaker.id, 'affiliation', e.target.value)} 
                                      className="input-field bg-white py-2 text-sm" 
                                      placeholder="東京大学 大学院工学系研究科" 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">役職 <RequiredBadge /></label>
                                    <input 
                                      required={!IS_TEST_MODE} 
                                      value={speaker.title} 
                                      onChange={(e) => updateSpeaker(content.id, speaker.id, 'title', e.target.value)} 
                                      className="input-field bg-white py-2 text-sm" 
                                      placeholder="教授" 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">連絡先メールアドレス <RequiredBadge /></label>
                                    <input 
                                      required={!IS_TEST_MODE} 
                                      type="email" 
                                      value={speaker.email} 
                                      onChange={(e) => updateSpeaker(content.id, speaker.id, 'email', e.target.value)} 
                                      className="input-field bg-white py-2 text-sm" 
                                      placeholder="speaker@example.com" 
                                    />
                                  </div>
                                  <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">プロフィール</label>
                                    <textarea 
                                      value={speaker.profile || ''} 
                                      onChange={(e) => updateSpeaker(content.id, speaker.id, 'profile', e.target.value)} 
                                      className="input-field bg-white py-2 text-sm resize-none" 
                                      rows={2}
                                      placeholder="任意の記入です。200字程度を推奨します" 
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}

                            <button 
                              type="button"
                              onClick={() => addSpeaker(content.id)}
                              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-bold"
                            >
                              <Plus size={16} />
                              <span>登壇者を追加</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <button 
                      type="button"
                      onClick={addContent}
                      className="w-full py-8 border-2 border-dashed border-blue-200 rounded-[2.5rem] text-blue-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                        <Plus size={24} />
                      </div>
                      <span className="text-lg font-bold">新しいコンテンツを追加</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Assets (イベント情報) */}
              {currentStep === 'ASSETS' && (
                <motion.div 
                  key="ASSETS"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="border-l-4 border-blue-600 pl-5">
                    <h2 className="text-2xl font-bold text-slate-800">イベント情報データ</h2>
                    <p className="text-slate-500 text-sm">必要に応じてアップロードしてください。</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center">イベント案内ページURL</label>
                        <div className="relative">
                          <input type="url" name="eventUrl" value={data.eventUrl} onChange={handleInputChange} className="input-field pl-10" placeholder="https://www.u-tokyo.ac.jp/..." />
                          <ExternalLink size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center">チラシ（10MBまで）</label>
                        <div className="relative">
                          <input type="file" onChange={(e) => handleFileChange(e, 'flyer')} className="sr-only" id="flyer-upload" />
                          <label htmlFor="flyer-upload" className="input-field bg-white cursor-pointer flex items-center justify-between hover:border-blue-400 transition-colors">
                            <span className={fileNames.flyer ? 'text-slate-900' : 'text-slate-400'}>
                              {fileNames.flyer || 'ファイルを選択'}
                            </span>
                            <Upload size={16} className="text-slate-400" />
                          </label>
                        </div>
                      </div>

                      {(data.desiredServices || []).includes('完成動画の公開のみ') && (
                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-700 flex items-center">主催部局のロゴ</label>
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <label className={`choice-card flex-1 ${data.logo !== '提出しない（部局のロゴがない等)' ? 'active' : ''}`}>
                                <input 
                                  type="radio" 
                                  name="logo_mode" 
                                  checked={data.logo !== '提出しない（部局のロゴがない等)'} 
                                  onChange={() => setData(prev => ({ ...prev, logo: '提出' }))} 
                                  className="sr-only" 
                                />
                                <span className="font-bold text-sm">提出する</span>
                              </label>
                              <label className={`choice-card flex-1 ${data.logo === '提出しない（部局のロゴがない等)' ? 'active' : ''}`}>
                                <input 
                                  type="radio" 
                                  name="logo_mode" 
                                  checked={data.logo === '提出しない（部局のロゴがない等)'} 
                                  onChange={() => setData(prev => ({ ...prev, logo: '提出しない（部局のロゴがない等)' }))} 
                                  className="sr-only" 
                                />
                                <span className="font-bold text-sm">提出しない（部局のロゴがない等)</span>
                              </label>
                            </div>
                            {data.logo !== '提出しない（部局のロゴがない等)' && (
                              <div className="relative">
                                <input type="file" onChange={(e) => handleFileChange(e, 'logo')} className="sr-only" id="logo-upload-a" />
                                <label htmlFor="logo-upload-a" className="input-field bg-white cursor-pointer flex items-center justify-between hover:border-blue-400 transition-colors">
                                  <span className={fileNames.logo ? 'text-slate-900' : 'text-slate-400'}>
                                    {fileNames.logo || 'ロゴ画像を選択'}
                                  </span>
                                  <Upload size={16} className="text-slate-400" />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {(data.desiredServices || []).includes('完成動画の公開のみ') && (
                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-700 flex items-center">サムネイル <RequiredBadge /></label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <label className={`choice-card flex-1 ${data.thumbnail !== '作成依頼' ? 'active' : ''}`}>
                              <input 
                                type="radio" 
                                name="thumbnail_mode" 
                                checked={data.thumbnail !== '作成依頼'} 
                                onChange={() => setData(prev => ({ ...prev, thumbnail: '提出' }))} 
                                className="sr-only" 
                              />
                              <span className="font-bold text-sm">提出する</span>
                            </label>
                            <label className={`choice-card flex-1 ${data.thumbnail === '作成依頼' ? 'active' : ''}`}>
                              <input 
                                type="radio" 
                                name="thumbnail_mode" 
                                checked={data.thumbnail === '作成依頼'} 
                                onChange={() => setData(prev => ({ ...prev, thumbnail: '作成依頼' }))} 
                                className="sr-only" 
                              />
                              <span className="font-bold text-sm">UTokyo Channelに作成を依頼</span>
                            </label>
                          </div>

                          {data.thumbnail !== '作成依頼' ? (
                            <div className="relative">
                              <input type="file" onChange={(e) => handleFileChange(e, 'thumbnail')} className="sr-only" id="thumbnail-upload" />
                              <label htmlFor="thumbnail-upload" className="input-field bg-white cursor-pointer flex items-center justify-between hover:border-blue-400 transition-colors">
                                <span className={fileNames.thumbnail ? 'text-slate-900' : 'text-slate-400'}>
                                  {fileNames.thumbnail || 'ファイルを選択'}
                                </span>
                                <Upload size={16} className="text-slate-400" />
                              </label>
                            </div>
                          ) : (
                            <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3 text-blue-800 border border-blue-100">
                              <div className="mt-0.5 shrink-0"><Info size={16} /></div>
                              <p className="text-xs leading-relaxed">
                                UTokyo Channelで作成する場合、基本的に動画からキャプチャーした静止画を使用します。
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {route === 'A' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center">
                              YouTube URL
                              <span className="text-[10px] font-normal text-slate-500 ml-2">(既にYouTubeで動画を公開済みの場合)</span>
                            </label>
                            <div className="relative">
                              <input type="url" name="youtubeUrl" value={data.youtubeUrl} onChange={handleInputChange} className="input-field pl-10" placeholder="https://youtube.com/..." />
                              <ExternalLink size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                            <label className="flex items-start space-x-3 cursor-pointer group">
                              <div className="relative flex items-center h-5 mt-0.5">
                                <input 
                                  type="checkbox" 
                                  name="youtubeCopyrightConfirm" 
                                  checked={data.youtubeCopyrightConfirm} 
                                  onChange={(e) => setData(prev => ({ ...prev, youtubeCopyrightConfirm: e.target.checked }))}
                                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer transition-colors" 
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-amber-900 leading-relaxed group-hover:text-amber-700 transition-colors">
                                  著作権及び肖像権などの権利処理・映像編集済みの動画をUTokyo Channelで公開します <RequiredBadge />
                                </span>
                                <p className="text-[10px] text-amber-700 mt-1">※公開にあたっての必須確認事項です</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">連絡事項等</label>
                      <textarea name="notes" value={data.notes} onChange={handleInputChange} rows={3} className="input-field resize-none" placeholder={"例)別途動画データを提供します。"} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Policies & Consent (注意及び確認事項) */}
              {currentStep === 'POLICIES' && (
                <motion.div 
                  key="POLICIES"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="border-l-4 border-blue-600 pl-5">
                    <h2 className="text-2xl font-bold text-slate-800">注意及び確認事項</h2>
                    <p className="text-slate-500 text-sm">公開にあたっての重要な確認事項です。</p>
                  </div>

                  <div className="space-y-10">
                    {/* 講義資料について */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">講義資料の出所表記</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        資料作成者（講師）には、利用した他人の著作物に出所を明記していただくようにしてください。詳しくは登壇者にご署名いただく<a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">「同意書」</a>をご参照ください。
                      </p>
                      <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          name="materialCopyrightConfirm" 
                          checked={data.materialCopyrightConfirm} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-bold text-slate-700">資料作成者が出所を明記していることを確認します <RequiredBadge /></span>
                      </label>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">※UTokyo Channel事務局より資料作成者（講師）に確認させていただく場合があります。</p>
                      </div>
                    </div>

                    {/* 公開確認の期限設定 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">公開確認の期限設定</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        公開前に、登壇者の方に動画の内容確認をしていただくことになっています。こちらからの確認依頼にご返信のないまま<span className="underline">4週間</span>が経過しますと、ご承認いただいたものとして公開作業を進めます。
                      </p>
                      <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          name="fourWeekConsent" 
                          checked={data.fourWeekConsent} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-bold text-slate-700">返信がない場合の公開に同意します <RequiredBadge /></span>
                      </label>
                    </div>

                    {/* 講師への伝達事項 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">講師への伝達事項</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        「講義資料作成時の注意点」「講義資料作成のためのQ＆A」ページを必ず講師にお伝えください。
                      </p>
                      <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          name="speakerInstructionConfirm" 
                          checked={data.speakerInstructionConfirm} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-bold text-slate-700">伝えます <RequiredBadge /></span>
                      </label>
                    </div>

                    {/* 条件分岐のトリガー */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="hasQA" 
                          checked={data.hasQA} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">質疑応答部分を公開する場合</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="hasInterpretation" 
                          checked={data.hasInterpretation} 
                          onChange={handleInputChange} 
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">同時通訳・手話通訳がある場合</span>
                      </label>
                    </div>

                    {/* 分岐A：質疑応答の公開について */}
                    <AnimatePresence>
                      {data.hasQA && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 space-y-6">
                            
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-blue-800">①参加者の顔・声 <RequiredBadge /></h4>
                              <p className="text-xs text-blue-700 leading-relaxed">参加者の顔や声を公開する場合には、本人の同意が必要です。</p>
                              <div className="flex flex-col space-y-2">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="qaParticipantConsent" 
                                    value="yes" 
                                    checked={data.qaParticipantConsent === 'yes'} 
                                    onChange={handleInputChange} 
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                  />
                                  <span className="text-sm text-blue-900">公開します。参加者の同意を得ています。</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="qaParticipantConsent" 
                                    value="no" 
                                    checked={data.qaParticipantConsent === 'no'} 
                                    onChange={handleInputChange} 
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                  />
                                  <span className="text-sm text-blue-900">公開しません</span>
                                </label>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-blue-800">②質疑応答部分の公開方法 <RequiredBadge /></h4>
                              <div className="flex flex-col space-y-2">
                                {[
                                  { id: 'full', label: '質問者の顔／声を含む' },
                                  { id: 'voice', label: '質問者の声のみ' },
                                  { id: 'summary', label: 'テロップで質問を要約(顔/声は公開しません。)' }
                                ].map(opt => (
                                  <label key={opt.id} className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name="qaMethod" 
                                      value={opt.id} 
                                      checked={data.qaMethod === opt.id} 
                                      onChange={handleInputChange} 
                                      className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm text-blue-900">{opt.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 分岐B：同時通訳・手話通訳について */}
                    <AnimatePresence>
                      {data.hasInterpretation && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 space-y-6">
                            <p className="text-sm text-indigo-700 leading-relaxed">公開にあたっては通訳者の同意が必要です。 <RequiredBadge /></p>
                            <div className="flex flex-col space-y-2">
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="interpreterConsentRadio" 
                                  value="yes" 
                                  checked={data.interpreterConsentRadio === 'yes'} 
                                  onChange={handleInputChange} 
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                                />
                                <span className="text-sm text-indigo-900">公開します。通訳者から同意を得ています</span>
                              </label>
                              <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="interpreterConsentRadio" 
                                  value="no" 
                                  checked={data.interpreterConsentRadio === 'no'} 
                                  onChange={handleInputChange} 
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                                />
                                <span className="text-sm text-indigo-900">公開しません。</span>
                              </label>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 'CONFIRM' && (
                <motion.div 
                  key="CONFIRM"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-10"
                >
                  <div className="text-center space-y-3 pb-4 border-b border-slate-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-2">
                      <FileText size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">入力内容の確認</h2>
                    <p className="text-slate-500 max-w-lg mx-auto">申請を送信する前に、以下の内容に間違いがないかご確認ください。各項目の「編集」ボタンから修正が可能です。</p>
                  </div>

                  <div className="space-y-12">
                    {/* Section I: Basic */}
                    <section className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm">1</span>
                        基本情報
                      </h3>
                      <div className="space-y-1">
                        <ReviewItem label="申請内容" value={data.appType === 'new' ? '新しい動画の公開（シリーズ自体が未公開）' : '公開中シリーズへの追加'} step="BASIC" />
                        <ReviewItem label="コンテンツ種別" value={data.contentType} step="BASIC" />
                        <ReviewItem label="希望するサービス" value={(data.desiredServices || []).join('、')} step="BASIC" />
                        <ReviewItem label="公開範囲" value={data.releaseScope === 'general' ? '一般公開' : '学内限定'} step="BASIC" />
                      </div>
                    </section>

                    {/* Section II: Submitter & Event */}
                    <section className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm">2</span>
                        申請者・イベント情報
                      </h3>
                      <div className="space-y-1">
                        <ReviewItem label="部局・所属" value={data.department} step="SUBMITTER" />
                        <ReviewItem label="部局の役割" value={data.departmentRole} step="SUBMITTER" />
                        {data.otherDepartmentName && <ReviewItem label="共催・他部局名" value={data.otherDepartmentName} step="SUBMITTER" />}
                        <ReviewItem label="担当者名" value={data.contactName} step="SUBMITTER" />
                        <ReviewItem label="メールアドレス" value={data.contactEmail} step="SUBMITTER" />
                        <ReviewItem label="学部長等承認" value={data.deanApproval ? 'あり' : 'なし'} step="SUBMITTER" />
                        {route === 'A' && data.deanApproval && (
                          <>
                            <ReviewItem label="承認者・役職" value={data.approverTitle} step="SUBMITTER" />
                            <ReviewItem label="承認者氏名" value={data.approverName} step="SUBMITTER" />
                          </>
                        )}
                        
                        <div className="pt-6 mt-4 border-t border-slate-200">
                          <ReviewItem label="催事名" value={data.eventName} step="SUBMITTER" />
                          <ReviewItem label="開催日時" value={data.eventDateTime} step="SUBMITTER" />
                          <ReviewItem label="開催場所" value={data.eventLocation} step="SUBMITTER" />
                        </div>
                      </div>
                    </section>

                    {/* Section III: Details */}
                    <section className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm">3</span>
                        コンテンツ詳細・登壇者
                      </h3>
                      <div className="space-y-6">
                        {(data.contents || []).map((content, idx) => (
                          <div key={content.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-blue-600">動画 {idx + 1}: {content.title}</h4>
                              <button 
                                type="button" 
                                onClick={() => jumpToStep('DETAILS')}
                                className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1"
                              >
                                <Pencil size={12} />
                                <span>編集</span>
                              </button>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">{content.description}</p>
                            <div className="space-y-3">
                              {(content.speakers || []).map(speaker => (
                                <div key={speaker.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-dotted border-slate-200">
                                  <div className="font-bold text-slate-800">{speaker.name}</div>
                                  <div className="text-slate-500">{speaker.affiliation} / {speaker.title}</div>
                                  <div className="text-blue-500 font-mono mt-1">{speaker.email}</div>
                                  {speaker.profile && (
                                    <div className="text-slate-600 mt-2 pt-2 border-t border-slate-100">
                                      <span className="font-bold text-slate-700">プロフィール:</span> <span className="whitespace-pre-wrap">{speaker.profile}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Section IV: Assets */}
                    <section className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm">4</span>
                        イベント情報データ
                      </h3>
                      <div className="space-y-1">
                        {route === 'A' && <ReviewItem label="イベントWebサイト" value={data.eventUrl} step="ASSETS" />}
                        <ReviewItem label="チラシ等" value={fileNames.flyer || '提出しない'} step="ASSETS" />
                        {(data.desiredServices || []).includes('完成動画の公開のみ') && <ReviewItem label="ロゴデータ" value={fileNames.logo || data.logo} step="ASSETS" />}
                        {(data.desiredServices || []).includes('完成動画の公開のみ') && <ReviewItem label="サムネイル" value={fileNames.thumbnail || data.thumbnail} step="ASSETS" />}
                        {route === 'A' && (
                          <>
                            <ReviewItem label="参考URL(YouTube等)" value={data.youtubeUrl} step="ASSETS" />
                            <ReviewItem label="権利処理の要否" value={data.youtubeCopyrightConfirm ? '確認済み' : '未確認'} step="ASSETS" />
                          </>
                        )}
                        {data.notes && <ReviewItem label="備考" value={data.notes} step="ASSETS" />}
                      </div>
                    </section>

                    {/* Section V: Policies (Route B only) */}
                    {route === 'B' && (
                      <section className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                          <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm">5</span>
                          注意及び確認事項
                        </h3>
                        <div className="space-y-1">
                          <ReviewItem label="著作権確認" value={data.materialCopyrightConfirm ? '同意済み' : '未同意'} step="POLICIES" />
                          <ReviewItem label="4週間前同意" value={data.fourWeekConsent ? '同意済み' : '未同意'} step="POLICIES" />
                          <ReviewItem label="登壇者への説明" value={data.speakerInstructionConfirm ? '確認済み' : '未確認'} step="POLICIES" />
                          <ReviewItem label="QAの有無" value={data.hasQA ? 'あり' : 'なし'} step="POLICIES" />
                          {data.hasQA && (
                            <>
                              <ReviewItem label="質問者の同意" value={data.qaParticipantConsent === 'yes' ? '得ている' : '得ていない'} step="POLICIES" />
                              <ReviewItem label="公開方法" value={data.qaMethod === 'full' ? '全部公開' : data.qaMethod === 'voice' ? '音声のみ' : '要約のみ'} step="POLICIES" />
                            </>
                          )}
                          <ReviewItem label="通訳の有無" value={data.hasInterpretation ? 'あり' : 'なし'} step="POLICIES" />
                          {data.hasInterpretation && (
                            <ReviewItem label="通訳者の同意" value={data.interpreterConsentRadio === 'yes' ? '得ている' : '得ていない'} step="POLICIES" />
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-10">
              <div className="w-full md:w-auto">
                {currentStep !== 'BASIC' && (
                  <button type="button" onClick={prevStep} className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3 text-slate-500 font-bold hover:text-slate-900 transition-all rounded-xl">
                    <ChevronLeft size={20} />
                    <span>戻る</span>
                  </button>
                )}
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center">
                {isEditMode && currentStep !== 'CONFIRM' && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditMode(false);
                      setCurrentStep('CONFIRM');
                      try {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (e) {
                        window.scrollTo(0, 0);
                      }
                    }} 
                    className="w-full md:w-auto px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    入力内容確認に戻る
                  </button>
                )}
                {currentStep === 'CONFIRM' ? (
                  <button type="submit" className="w-full md:w-auto px-12 py-4 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95">
                    申請を送信する
                  </button>
                ) : (
                  <button type="button" onClick={nextStep} className="w-full md:w-auto flex items-center justify-center space-x-2 px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 font-sans">
                    <span>{((route === 'A' && currentStep === 'ASSETS') || (route === 'B' && currentStep === 'POLICIES')) ? '確認画面へ進む' : '次へ進む'}</span>
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>

      <footer className="mt-20 text-center pb-12">
        <p className="text-slate-400 text-xs mb-4">
          © {new Date().getFullYear()} 東京大学 大学総合教育研究センター 
        </p>
        <div className="flex justify-center space-x-6">
          <a href="https://tv.he.u-tokyo.ac.jp/page/about" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 text-[10px] font-medium transition-colors">東大TVについて</a>
          <a href="https://tv.he.u-tokyo.ac.jp/page/terms" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 text-[10px] font-medium transition-colors">利用規約</a>
          <a href="https://tv.he.u-tokyo.ac.jp/page/contact" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 text-[10px] font-medium transition-colors">お問い合わせ</a>
        </div>
      </footer>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          font-size: 0.9375rem;
          transition: all 0.2s ease-in-out;
          background-color: #f8fafc;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background-color: #ffffff;
        }
        .choice-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border: 2px solid #f1f5f9;
          border-radius: 1.25rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          background-color: #ffffff;
        }
        .choice-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        .choice-card.active {
          border-color: #3b82f6;
          background-color: #eff6ff;
          color: #1e40af;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
