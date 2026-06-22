import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Trash2, 
  Database, 
  Download, 
  Calendar, 
  User, 
  Mail, 
  Clock, 
  Info, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  FileText,
  X,
  Plus,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { SubmissionData } from '../types';

export interface SavedSubmission {
  id: string;
  submittedAt: string;
  status: 'new' | 'processing' | 'completed';
  adminNotes: string;
  data: SubmissionData;
}

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [submissions, setSubmissions] = useState<SavedSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('new');
  const [selectedSub, setSelectedSub] = useState<SavedSubmission | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [tempStatus, setTempStatus] = useState<'new' | 'processing' | 'completed'>('new');
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  // Load submissions from localStorage on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    try {
      const stored = localStorage.getItem('utchannel_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // ensure every older submission has a valid status, defaulting to 'new' (未対応)
          const sanitized = parsed.map((item: any) => ({
            ...item,
            status: item.status === 'processing' || item.status === 'completed' ? item.status : 'new',
            adminNotes: item.adminNotes || ''
          }));
          setSubmissions(sanitized);
          return;
        }
      }
      setSubmissions([]);
    } catch (e) {
      console.error('Failed to load submissions', e);
      setSubmissions([]);
    }
  };



  // Generate high quality sample submissions
  const generateSampleData = () => {
    const samples: SavedSubmission[] = [
      {
        id: 'sub_demo_1',
        submittedAt: new Date(Date.now() - 3600000 * 24 * 2).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), // 2 days ago
        status: 'new',
        adminNotes: '初回確認：未調整。本学教授佐藤氏によるリベラルアーツ公開講義。チラシデータ確認済。',
        data: {
          appType: 'new',
          contentType: '正規授業',
          desiredServices: ['完成動画の公開のみ'],
          releaseScope: 'general',
          department: '教養学部 総合社会科学研究科',
          departmentRole: '主催',
          otherDepartmentName: '',
          contactName: '東大 太郎',
          contactEmail: 'tarotokyo@example.com',
          deanApproval: true,
          approverTitle: '学部長',
          approverName: '駒場 栄一',
          eventName: '第1回 現代のリベラルアーツ公開講義',
          eventDateTime: '2026年10月15日 14:00〜16:30',
          eventLocation: '駒場Ⅰキャンパス 数理科学研究科大講義室',
          eventDescription: '学内一般および外部に開かれた、社会の変容と学際的アプローチを問うシンポジウムを兼ねたリベラルアーツ講義。',
          contents: [
            {
              id: 'c1',
              title: '量子力学から見る近代社会論と数理モデル',
              description: '相対性理論、現代量子力学の哲学的解釈がどのように社会構造や現代の意思決定理論に影響を与えたかを解説。',
              speakers: [
                {
                  id: 's1',
                  name: '佐藤 博司',
                  affiliation: '教養学部 教授',
                  title: '教授',
                  email: 'sato@example.com',
                  profile: '数理社会学と理論量子力学の学際研究。著書「不確実性と社会のダイナミクス」。'
                }
              ]
            }
          ],
          eventUrl: 'https://www.u-tokyo.ac.jp/demo-liberal-arts',
          flyer: 'liberal_arts_flyer.pdf',
          logo: '提出しない（部局のロゴがない等)',
          thumbnail: '提出',
          youtubeUrl: 'https://youtube.com/watch?v=demo12345',
          youtubeCopyrightConfirm: true,
          notes: '東大TVに初めて申請する講義となります。ご不明な点がございましたらご連絡ください。',
          materialCopyrightConfirm: true,
          fourWeekConsent: true,
          speakerInstructionConfirm: true,
          hasQA: false,
          hasInterpretation: false
        }
      },
      {
        id: 'sub_demo_2',
        submittedAt: new Date(Date.now() - 3600000 * 5).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), // 5 hours ago
        status: 'processing',
        adminNotes: '編集部門へ依頼。撮影機材はB対応に割り当て済み。著作権周りの確認は現在進行中。',
        data: {
          appType: 'new',
          contentType: 'その他',
          desiredServices: ['撮影', '著作権処理', '映像編集'],
          releaseScope: 'general',
          department: '理学系研究科 物理学専攻',
          departmentRole: '主催',
          otherDepartmentName: '',
          contactName: '理学 花子',
          contactEmail: 'hanako@phys.s.u-tokyo.ac.jp',
          deanApproval: true,
          approverTitle: '研究科長',
          approverName: '本郷 一郎',
          eventName: '先端宇宙物理学国際シンポジウム2026',
          eventDateTime: '2026年11月22日 10:00〜17:00',
          eventLocation: '本郷キャンパス 小柴ホール',
          eventDescription: 'JWST（ジェイムズ・ウェッブ宇宙望遠鏡）の最新観測データ結果を元に国内外の宇宙物理学者を招請。',
          contents: [
            {
              id: 'c2',
              title: 'ジェイムズ・ウェッブ宇宙望遠鏡による初代銀河系の形成理論',
              description: '深宇宙探査シミュレーションデータの最新成果発表、およびインフレーションモデルとの対応検証。',
              speakers: [
                {
                  id: 's2',
                  name: '大塚 健二',
                  affiliation: '理学系研究科 宇宙理論センター',
                  title: '准教授',
                  email: 'otsuka@phys.s.u-tokyo.ac.jp',
                  profile: '理論宇宙物理学者。初代星・初代銀河形成史のスーパーコンピュータシミュレーションで著名。'
                }
              ]
            }
          ],
          flyer: 'space_phys_2026_guide.png',
          logo: '指定なし',
          thumbnail: '作成依頼',
          notes: '撮影は2カメ構成を希望します。スライド投影画面と発表者のピクチャーインピクチャーで編集をお願いしたいです。',
          materialCopyrightConfirm: true,
          fourWeekConsent: true,
          speakerInstructionConfirm: true,
          hasQA: true,
          qaParticipantConsent: 'yes',
          qaMethod: 'full',
          hasInterpretation: true,
          interpreterConsentRadio: 'yes'
        }
      },
      {
        id: 'sub_demo_3',
        submittedAt: new Date(Date.now() - 3600000 * 24 * 4).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }), // 4 days ago
        status: 'completed',
        adminNotes: '動画公開処理及びUTokyo TVポータルへの掲載完了。部局宛公開完了通知メール送信済み。',
        data: {
          appType: 'add',
          contentType: '学術シリーズ',
          desiredServices: ['完成動画 of 公開のみ', '完成動画の公開のみ'],
          releaseScope: 'general',
          department: '工学系研究科 システム創成学専攻',
          departmentRole: '主催',
          otherDepartmentName: '',
          contactName: '工学 次郎',
          contactEmail: 'jiro@sys.t.u-tokyo.ac.jp',
          deanApproval: true,
          approverTitle: '研究科長',
          approverName: '弥生 創平',
          eventName: '第42回 未来社会創造工学フォーラム',
          eventDateTime: '2026年09月05日 13:30〜15:30',
          eventLocation: 'オンライン（Zoomウェビナー配信）',
          eventDescription: 'デジタルツインとメタバース技術を融合させた未来型社会インフラの課題と展望を討論。',
          contents: [
            {
              id: 'c3',
              title: '複雑社会システムの数理モデルとデジタルツインプラットフォームの実装',
              description: 'ビッグデータを利活用した実交通・人流データの高精度シミュレーション、最適化アルゴリズム。',
              speakers: [
                {
                  id: 's3',
                  name: '鈴木 雅人',
                  affiliation: '工学系研究科 准教授',
                  title: '准教授',
                  email: 'suzuki@sys.t.u-tokyo.ac.jp',
                  profile: '都市工学とマルチエージェントシミュレーションの研究。スマートシティ検討委員。'
                }
              ]
            }
          ],
          flyer: 'future_forum_2026.pdf',
          logo: '提出しない（部局のロゴがない等)',
          thumbnail: '既にある動画サムネイルを使用',
          notes: 'すでに編集・エンコード済みのMP4ファイルをアップロードいたします。公開確認は、公開限定リンクでご指示の通りに行います。',
          materialCopyrightConfirm: true,
          fourWeekConsent: true,
          speakerInstructionConfirm: true,
          hasQA: false,
          hasInterpretation: false
        }
      }
    ];

    try {
      const existingRaw = localStorage.getItem('utchannel_submissions');
      const existing: SavedSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
      
      // Filter out any existing item that matches the newly injected sample IDs to prevent infinite duplicates
      const filteredExisting = existing.filter(ex => !samples.some(s => s.id === ex.id));
      
      const updated = [...samples, ...filteredExisting];
      localStorage.setItem('utchannel_submissions', JSON.stringify(updated));
      loadSubmissions();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete individual submission
  const deleteSubmission = (id: string) => {
    if (confirm('この申請データを削除してもよろしいですか？（この操作は元に戻せません）')) {
      const updated = submissions.filter(s => s.id !== id);
      localStorage.setItem('utchannel_submissions', JSON.stringify(updated));
      setSubmissions(updated);
      if (selectedSub?.id === id) {
        setSelectedSub(null);
      }
    }
  };

  // Clear all data
  const handleClearAll = () => {
    localStorage.removeItem('utchannel_submissions');
    setSubmissions([]);
    setSelectedSub(null);
    setShowConfirmDeleteAll(false);
  };

  // Select a submission for viewing detail
  const handleViewDetail = (sub: SavedSubmission) => {
    setSelectedSub(sub);
    setTempNotes(sub.adminNotes || '');
    setTempStatus(sub.status);
  };

  // Save changes to notes and status within detail panel
  const handleSaveAdminUpdate = () => {
    if (!selectedSub) return;
    const updatedSubIndex = submissions.findIndex(s => s.id === selectedSub.id);
    if (updatedSubIndex > -1) {
      const updated = [...submissions];
      updated[updatedSubIndex] = {
        ...selectedSub,
        status: tempStatus,
        adminNotes: tempNotes
      };
      localStorage.setItem('utchannel_submissions', JSON.stringify(updated));
      setSubmissions(updated);
      setSelectedSub({
        ...selectedSub,
        status: tempStatus,
        adminNotes: tempNotes
      });
      alert('ステータスと管理者メモを更新しました。');
    }
  };

  // Export submissions as JSON
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(submissions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `utokyo_channel_submissions_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      alert('データのエクスポートに失敗しました。');
    }
  };

  // Filter & Search logic
  const filteredSubmissions = submissions.filter(sub => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || [
      sub.data.department,
      sub.data.contactName,
      sub.data.contactEmail,
      sub.data.eventName,
      sub.data.eventLocation,
      sub.id
    ].some(field => field && field.toLowerCase().includes(query));

    // 2. Status Filter
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats for widgets
  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    processing: submissions.filter(s => s.status === 'processing').length,
    completed: submissions.filter(s => s.status === 'completed').length,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
            title="申請画面に戻る"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-wider">UTokyo Channel</span>
              <span className="text-sm font-bold text-slate-500">管理者モード</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">申請回答管理データベース</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={generateSampleData}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-extrabold rounded-xl transition-all border border-blue-200/50"
          >
            <Sparkles size={14} />
            <span>デモデータの追加</span>
          </button>
          
          {submissions.length > 0 && (
            <button 
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all shadow-sm"
            >
              <Download size={14} />
              <span>JSON書出</span>
            </button>
          )}

          <button 
            onClick={() => setShowConfirmDeleteAll(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-extrabold rounded-xl transition-all"
          >
            <Trash2 size={14} />
            <span>全データ消去</span>
          </button>
        </div>
      </div>

      {/* Delete All Confirmation Dialog */}
      {showConfirmDeleteAll && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-[1.5rem] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start space-x-3 text-red-800">
            <AlertCircle className="shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-extrabold text-sm">すべての申請回答データをリセットしますか？</p>
              <p className="text-xs text-red-700 mt-1">ローカルブラウザの「utchannel_submissions」ストレージに保存されているすべての回答が削除され、復元することはできません。</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setShowConfirmDeleteAll(false)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              キャンセル
            </button>
            <button 
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md shadow-red-100"
            >
              本当に消去する
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-bold">未対応</span>
            {stats.new > 0 && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
          </div>
          <span className="text-2xl font-black text-red-600 mt-2 flex items-baseline">
            {stats.new}
            <span className="text-xs text-slate-400 font-medium ml-1">件</span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-bold">対応中</span>
          <span className="text-2xl font-black text-amber-600 mt-2 flex items-baseline">
            {stats.processing}
            <span className="text-xs text-slate-400 font-medium ml-1">件</span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-bold">完了</span>
          <span className="text-2xl font-black text-emerald-600 mt-2 flex items-baseline">
            {stats.completed}
            <span className="text-xs text-slate-400 font-medium ml-1">件</span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-bold">全申請件数</span>
          <span className="text-2xl font-black text-slate-800 mt-2 flex items-baseline">
            {stats.total}
            <span className="text-xs text-slate-400 font-medium ml-1">件</span>
          </span>
        </div>
      </div>

      {/* Query Filters Area */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="部局名、担当者、イベント名、eMailで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter buttons */}
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              {[
                { id: 'new', label: '未対応' },
                { id: 'processing', label: '対応中' },
                { id: 'completed', label: '完了' },
                { id: 'all', label: 'すべて' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-md transition-all ${statusFilter === st.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {(statusFilter !== 'new' || searchQuery) && (
              <button 
                onClick={() => {
                  setStatusFilter('new');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold px-2 py-1.5 transition-colors"
              >
                クリア
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table / Submissions Cards */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ClipboardList size={32} />
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-lg">表示する申請データはありません</p>
              <p className="text-sm text-slate-400 mt-1">
                {submissions.length === 0 ? 'まだ申請が届いていません。上の「デモデータを追加」をクリックしてサンプルデータを確認できます。' : '検索・フィルター条件に一致するデータがありませんでした。'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSubmissions.map((sub) => {
              return (
                <div 
                  key={sub.id}
                  className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Left Highlight Strip according to Status */}
                  <div className={`w-2 md:w-3 shrink-0 ${
                    sub.status === 'new' ? 'bg-red-500' :
                    sub.status === 'processing' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`} />

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Label */}
                        {sub.status === 'new' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-extrabold border border-red-200">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                            未対応
                          </span>
                        )}
                        {sub.status === 'processing' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold border border-amber-200">
                            対応中
                          </span>
                        )}
                        {sub.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-extrabold border border-green-200">
                            完了
                          </span>
                        )}

                        {/* AppType Badge */}
                        <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-500 rounded-full text-[10px] font-extrabold">
                          {sub.data.appType === 'new' ? '新規シリーズ' : '動画追加'}
                        </span>

                        {/* Desired Services Badge */}
                        <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-[10px] font-extrabold">
                          希望：{(sub.data.desiredServices || []).join('、')}
                        </span>

                        {/* Timestamp */}
                        <span className="text-slate-400 text-xs font-bold font-mono ml-auto md:ml-2 flex items-center gap-1">
                          <Clock size={12} />
                          {sub.submittedAt}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 block">{sub.data.department}</span>
                        <h3 className="text-lg font-extrabold text-slate-800 leading-snug mt-0.5">{sub.data.eventName || <span className="text-slate-300 italic">（催事名未設定）</span>}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-600 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400 shrink-0" />
                          <span>{sub.data.contactName}（{sub.data.contactEmail}）</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:justify-end">
                          <span className="font-bold text-slate-400">登録動画数:</span>
                          <span className="font-extrabold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">{(sub.data.contents || []).length}本</span>
                        </div>
                      </div>

                      {sub.adminNotes && (
                        <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-500 italic border border-dotted border-slate-200 line-clamp-1 mt-2">
                          <span className="font-bold text-slate-650 not-italic mr-1.5">管理者メモ:</span>
                          {sub.adminNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button 
                        onClick={() => handleViewDetail(sub)}
                        className="flex items-center justify-center space-x-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span>詳細を見る</span>
                        <ChevronRight size={14} />
                      </button>
                      
                      <button 
                        onClick={() => deleteSubmission(sub.id)}
                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                        title="この申請を削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Modal Sidebar / Dialog */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          {/* Modal Sidebar Panel */}
          <div className="bg-white w-full max-w-4xl min-h-screen shadow-2xl p-6 md:p-10 flex flex-col space-y-8 animate-slideLeft">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5 shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black rounded-md">ID: {selectedSub.id}</span>
                  <span className="text-xs text-slate-450 font-bold">{selectedSub.submittedAt} 申請受付</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 pr-6 select-text">{selectedSub.data.eventName || '申請内容 詳細'}</h2>
              </div>
              <button 
                onClick={() => setSelectedSub(null)}
                className="p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scroll Container */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 max-h-[calc(100vh-270px)] select-text">
              
              {/* STATUS & NOTES EDITOR (ADMIN USE ONLY) */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Database size={16} />
                  <h3 className="text-sm font-black">管理者管理ステータス</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block">状況ステータスのお手入れ</label>
                    <select 
                      value={tempStatus} 
                      onChange={(e) => setTempStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value="new">🔴 未対応 (未着手)</option>
                      <option value="processing">🟡 対応中 (調整・収録編集進行中)</option>
                      <option value="completed">🟢 完了 (動画納品・公開完了)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSaveAdminUpdate}
                      className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all text-center"
                    >
                      変更を保存する
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">管理者メモ（タスク進捗や内部引き継ぎ事項を記載）</label>
                  <textarea 
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    rows={3}
                    placeholder="例：スライド処理の承諾書待ち、担当者〇〇（2026/06/16）"
                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* DETAILS RENDER PANEL */}
              <div className="space-y-6">
                
                {/* section 1 */}
                <div className="border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm bg-slate-50/20">
                  <h4 className="font-extrabold text-sm text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    1. 申請基本情報
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold">申請種別</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.appType === 'new' ? '新規シリーズ登録' : '既存シリーズに動画を追加'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">コンテンツ種別</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.contentType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">希望するサービス</span>
                      <span className="font-extrabold text-blue-650">{(selectedSub.data.desiredServices || []).join('、')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">公開範囲</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.releaseScope === 'general' ? '一般公開' : '学内限定限定'}</span>
                    </div>
                  </div>
                </div>

                {/* section 2 */}
                <div className="border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm bg-slate-50/20">
                  <h4 className="font-extrabold text-sm text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    2. 申請者・代表連絡先情報
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block font-bold">申請者所属・部局</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">部局主催権限</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.departmentRole}</span>
                    </div>
                    {selectedSub.data.otherDepartmentName && (
                      <div>
                        <span className="text-slate-400 block font-bold">共催等・他部局名</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.otherDepartmentName}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block font-bold">担当者氏名</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.contactName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">担当者メールアドレス</span>
                      <span className="font-extrabold text-blue-600 select-all font-mono">{selectedSub.data.contactEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">部局長等承認</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.deanApproval ? '承認確認済み' : '未承認'}</span>
                    </div>
                    {selectedSub.data.approverName && (
                      <div>
                        <span className="text-slate-400 block font-bold">承認責任者役職 / 氏名</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.approverTitle || '役職なし'} - {selectedSub.data.approverName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* section 2.5: event */}
                <div className="border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm bg-slate-50/20">
                  <h4 className="font-extrabold text-sm text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    3. イベント（催事）開催詳細
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold">催事（シンポジウム等）の名称</span>
                      <span className="font-extrabold text-slate-800 text-sm leading-tight block mt-0.5">{selectedSub.data.eventName || '（設定なし）'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                      <div>
                        <span className="text-slate-400 block font-bold">開催日時</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.eventDateTime || '（設定なし）'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">開催場所</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.eventLocation || '（設定なし）'}</span>
                      </div>
                    </div>
                    {selectedSub.data.eventDescription && (
                      <div>
                        <span className="text-slate-400 block font-bold">開催概要・目的</span>
                        <span className="font-medium text-slate-600 leading-relaxed block whitespace-pre-wrap mt-0.5 bg-white p-3 rounded-xl border border-slate-100">{selectedSub.data.eventDescription}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* section 3: items */}
                <div className="border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm bg-slate-50/20">
                  <h4 className="font-extrabold text-sm text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    4. 各動画コンテンツ & 登壇者情報（合計: {(selectedSub.data.contents || []).length}本）
                  </h4>

                  <div className="space-y-4">
                    {(selectedSub.data.contents || []).map((cnt, index) => (
                      <div key={cnt.id} className="bg-white p-4 rounded-xl border border-slate-100 space-y-3 shadow-xs">
                        <div className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg -mx-2">
                          <span className="font-black text-xs text-blue-700">動画 {index + 1}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ID: {cnt.id}</span>
                        </div>
                        
                        <div className="text-xs">
                          <span className="text-slate-400 block font-bold">動画コンテンツの正式名称</span>
                          <span className="font-extrabold text-slate-800 leading-snug text-sm block mt-0.5">{cnt.title}</span>
                        </div>

                        <div className="text-xs">
                          <span className="text-slate-400 block font-bold">講義・発表内容の説明文</span>
                          <p className="font-medium text-slate-600 leading-relaxed block whitespace-pre-wrap mt-0.5">{cnt.description || '（説明文なし）'}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">登壇者（合計: {(cnt.speakers || []).length}名）</span>
                          <div className="grid grid-cols-1 gap-2">
                            {(cnt.speakers || []).map(sp => (
                              <div key={sp.id} className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                                <div className="flex items-baseline justify-between gap-2 border-b border-dotted border-slate-200 pb-1">
                                  <span className="text-xs font-black text-slate-750">{sp.name} <span className="font-medium text-[10px] text-slate-500">氏</span></span>
                                  <span className="font-mono text-[9px] text-slate-400">{sp.email}</span>
                                </div>
                                <div className="text-[10px] font-medium text-slate-600 flex flex-wrap gap-x-2">
                                  <span className="font-bold text-slate-500">所属:</span> {sp.affiliation} / {sp.title}
                                </div>
                                {sp.profile && (
                                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/40">
                                    <span className="font-bold text-slate-450">プロフィール:</span> <span className="whitespace-pre-wrap">{sp.profile}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* section 4: files / assets */}
                <div className="border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm bg-slate-50/20">
                  <h4 className="font-extrabold text-sm text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    5. 添付データ & YouTube情報
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    {selectedSub.data.eventUrl && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block font-bold">催事関連Webサイト</span>
                        <a href={selectedSub.data.eventUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 inline-flex items-center gap-1 break-all hover:underline mt-0.5">
                          {selectedSub.data.eventUrl}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block font-bold">イベント告知用チラシ等</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.flyer || '提出なし'}</span>
                    </div>
                    {selectedSub.data.logo && (
                      <div>
                        <span className="text-slate-400 block font-bold">部局ロゴデータ</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.logo}</span>
                      </div>
                    )}
                    {selectedSub.data.thumbnail && (
                      <div>
                        <span className="text-slate-400 block font-bold">サムネイル希望</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.thumbnail}</span>
                      </div>
                    )}
                    {selectedSub.data.youtubeUrl && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block font-bold">参考動画URL（既存の限定公開YouTube等のURL）</span>
                        <a href={selectedSub.data.youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 inline-flex items-center gap-1 break-all hover:underline mt-0.5">
                          {selectedSub.data.youtubeUrl}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                    {selectedSub.data.youtubeCopyrightConfirm !== undefined && (
                      <div>
                        <span className="text-slate-400 block font-bold">YouTubeアップロード権確認</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.youtubeCopyrightConfirm ? '同意済み' : '未同意'}</span>
                      </div>
                    )}
                    {selectedSub.data.notes && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block font-bold">備考・要望要領</span>
                        <p className="font-medium text-slate-650 whitespace-pre-wrap mt-0.5 bg-white p-3 rounded-xl border border-slate-100">{selectedSub.data.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* section 5: consent/policies */}
                <div className="border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm bg-slate-50/20">
                  <h4 className="font-extrabold text-sm text-slate-805 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    6. 著作権及びその他確認事項（同意）
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold">著作物権利許諾（学術資産公開）</span>
                      <span className="font-extrabold text-green-700">{selectedSub.data.materialCopyrightConfirm ? '許諾・同意済み' : '未許諾'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">スケジュール等（4週間前納入）への合意</span>
                      <span className="font-extrabold text-green-700">{selectedSub.data.fourWeekConsent ? '合意・同意済み' : '未合意'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">登壇者への動画公開説明義務</span>
                      <span className="font-extrabold text-green-700">{selectedSub.data.speakerInstructionConfirm ? '周知・確認済み' : '未周知'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">質疑応答の有無</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.hasQA ? 'あり' : 'なし'}</span>
                    </div>
                    {selectedSub.data.hasQA && (
                      <>
                        <div>
                          <span className="text-slate-400 block font-bold">質疑者の対外的同意取得状況</span>
                          <span className="font-extrabold text-slate-700">{selectedSub.data.qaParticipantConsent === 'yes' ? '取得・同意済み' : '未取得'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold font-sans">質疑動画公開編集ポリシー</span>
                          <span className="font-extrabold text-slate-700">
                            {selectedSub.data.qaMethod === 'full' && '全て配信公開'}
                            {selectedSub.data.qaMethod === 'voice' && '音声のみ'}
                            {selectedSub.data.qaMethod === 'summary' && 'テキスト要約のみ'}
                          </span>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="text-slate-400 block font-bold">同時通訳・手話通訳</span>
                      <span className="font-extrabold text-slate-700">{selectedSub.data.hasInterpretation ? 'あり' : 'なし'}</span>
                    </div>
                    {selectedSub.data.hasInterpretation && (
                      <div>
                        <span className="text-slate-400 block font-bold">通訳者（翻訳著作権持分者）同意</span>
                        <span className="font-extrabold text-slate-700">{selectedSub.data.interpreterConsentRadio === 'yes' ? '同意取得済み' : '未同意'}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="shrink-0 border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  if (confirm('この申請を削除してもよろしいですか？（この操作は元に戻せません）')) {
                    deleteSubmission(selectedSub.id);
                  }
                }}
                className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-all"
              >
                この申請を削除
              </button>
              <button 
                onClick={() => setSelectedSub(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
