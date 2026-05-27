
export interface Speaker {
  id: string;
  name: string;
  affiliation: string;
  title: string;
  email: string;
  profile?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  speakers: Speaker[];
}

export interface SubmissionData {
  // Section I: Common
  appType: 'new' | 'add';
  contentType: '正規授業' | '学術シリーズ' | '対談・座談会・インタビュー' | 'オープンキャンパス・体験シリーズ' | '研修・ガイダンス' | 'その他';
  desiredServices: string[]; // 「撮影」「著作権処理」「映像編集」「完成動画の公開のみ」
  releaseScope: 'general' | 'campus';

  // Section II: Submitter & Event (Common but fields vary)
  department: string;
  departmentRole: '主催' | '共催 その他';
  otherDepartmentName?: string;
  contactName: string;
  contactEmail: string;
  deanApproval: boolean;
  approverName?: string; // Route A
  approverTitle?: string; // Route A
  
  eventName: string;
  eventDateTime: string;
  eventLocation: string;
  eventDescription: string;

  // Section III: Content & Speaker (Nested Structure)
  contents: ContentItem[];

  // Section IV: Assets
  eventUrl?: string; // Route A
  flyer?: string; // Link or filename
  logo?: string; // Route A: 「提出」 or 「指定なし」
  thumbnail?: string; // Route A: 「提出」 or 「作成依頼」
  youtubeUrl?: string; // Route A
  youtubeCopyrightConfirm?: boolean; // Route A
  notes?: string; // Route A

  // Section V: Policies & Consent (注意及び確認事項)
  materialCopyrightConfirm: boolean;
  fourWeekConsent: boolean;
  speakerInstructionConfirm: boolean;
  hasQA: boolean;
  hasInterpretation: boolean;
  qaParticipantConsent?: 'yes' | 'no';
  qaMethod?: 'full' | 'voice' | 'summary';
  interpreterConsentRadio?: 'yes' | 'no';

  copyrightConfirm?: boolean; // Route B (Legacy)
  speakerInstructionConfirmLegacy?: boolean; // Route B (Legacy)
  qaPublication?: string; // Route B: 「なし」「全部」「一部」など
  interpretation?: boolean; // Route B
  interpreterConsent?: boolean; // Route B
}

export type Step = 'BASIC' | 'SUBMITTER' | 'DETAILS' | 'ASSETS' | 'POLICIES' | 'CONFIRM';

export const STEPS: Step[] = ['BASIC', 'SUBMITTER', 'DETAILS', 'ASSETS', 'POLICIES', 'CONFIRM'];
