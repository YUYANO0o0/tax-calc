import { useState, useMemo } from 'react';
import './App.css';

type Lang = 'ja' | 'zh-CN' | 'zh-TW' | 'en';
const APP_RED = '#ff4d4d';

type LabelPart = { text: string; color?: string };

function App() {
  const [lang, setLang] = useState<Lang>('ja');
  const [inputValue, setInputValue] = useState<string>('1,100,000');

  const taxIncludedPrice = useMemo(() => Number(inputValue.replace(/,/g, '')), [inputValue]);

  const result = useMemo(() => {
    const a = taxIncludedPrice || 0;
    const b = Math.round(a / 1.1);
    const c = Math.round(b * 0.95);
    const d = Math.round(c * 0.1);
    const e = Math.round(c * 0.0155);
    const f = d - e;
    const g = Math.round(c * 1.1);
    const h = g - f;
    const saved = a - h;
    return { a, b, c, d, e, f, g, h, saved };
  }, [taxIncludedPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '') setInputValue('');
    else if (/^\d*$/.test(rawValue)) setInputValue(rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  const getItems = (lang: Lang): LabelPart[][] => {
    const base = {
      ja: [
        [{ text: "価格（税込）" }],
        [{ text: "価格（税抜）" }],
        [{ text: "ショッピングクーポン使用 5%OFF価格\n(b)×0.95" }],
        [{ text: "【消費税 10%】\n(c)×0.1" }],
        [{ text: "【手数料 1.55%】\n(c)×0.0155" }],
        [{ text: "【免税額】\n(d-e)" }],
        [{ text: "【店で支払う金額】\nショッピングクーポン使用 5%OFF価格税込\n(c)×1.1" }],
        [{ text: "【最終価格】", color: APP_RED }, { text: "\n(g) - (f)" }],
        [{ text: "得した金額\n(a) - (h)" }]
      ],
      'zh-CN': [
        [{ text: "价格（含税）" }],
        [{ text: "价格（不含税）" }],
        [{ text: "购物优惠券使用 5%OFF价格\n(b)×0.95" }],
        [{ text: "【消费税 10%】\n(c)×0.1" }],
        [{ text: "【手续费 1.55%】\n(c)×0.0155" }],
        [{ text: "【免税额】\n(d-e)" }],
        [{ text: "【店內应付金额】\n购物优惠券使用 5%OFF含税价格\n(c)×1.1" }],
        [{ text: "【最终价格】", color: APP_RED }, { text: "\n(g) - (f)" }],
        [{ text: "【省下金额】\n(a) - (h)" }]
      ],
      'zh-TW': [
        [{ text: "價格（含稅）" }],
        [{ text: "價格（不含稅）" }],
        [{ text: "購物優惠券使用 5%OFF價格\n(b)×0.95" }],
        [{ text: "【消費稅 10%】\n(c)×0.1" }],
        [{ text: "【手續稅 1.55%】\n(c)×0.0155" }],
        [{ text: "【免稅額】\n(d-e)" }],
        [{ text: "【店內应付金额】\n購物優惠券使用 5%OFF含稅價格\n(c)×1.1" }],
        [{ text: "【最終價格】", color: APP_RED }, { text: "\n(g) - (f)" }],
        [{ text: "【省下金额】\n(a) - (h)" }]
      ],
      en: [
        [{ text: "Price (Tax Incl.)" }],
        [{ text: "Price (Tax Excl.)" }],
        [{ text: "Shopping Coupon 5% OFF Price\n(b)×0.95" }],
        [{ text: "【Consumption Tax 10%】\n(c)×0.1" }],
        [{ text: "【Service Fee 1.55%】\n(c)×0.0155" }],
        [{ text: "【Tax Refund Amount】\n(d-e)" }],
        [{ text: "【Amount due at the store】\nShopping Coupon 5% OFF Price (Tax Incl)\n(c)×1.1" }],
        [{ text: "【Final Price】", color: APP_RED }, { text: "\n(g)-(f)" }],
        [{ text: "【Amount Saved】\n(a)-(h)" }]
      ]
    };
    return base[lang];
  };

  const currentItems = getItems(lang);
  const titles = { ja: "免税・ショッピングクーポン\n使用後の最終価格", 'zh-CN': "免税/购物优惠券使用后的最终价格", 'zh-TW': "免稅/購物優惠券使用後的最終價格", en: "Final Price After Tax Exemption & Shopping Coupon" };
  const refundDesc = { ja: "※免税カウンターで免税手続きをして返ってくる現金", 'zh-CN': "※在退税柜台办理免税手续后退回的现金", 'zh-TW': "※在退稅櫃檯辦理免稅手續後退回的現金", en: "※The tax refund received after completing the tax-free procedure at the counter." };

  const RedCode = ({ code }: { code: string }) => <span style={{ color: APP_RED, width: '30px', textAlign: 'right', flexShrink: 0, alignSelf: 'center' }}>{code}</span>;

  const Row = ({ labelParts, value, code, emphasize = false, isRefund = false, isFinal = false }: any) => {
    return (
      <div style={{ paddingBottom: '10px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: emphasize ? '10px' : '12px 0', 
          borderBottom: emphasize ? 'none' : '1px solid #eee',
          border: emphasize ? `3px solid ${APP_RED}` : 'none',
          borderRadius: emphasize ? '8px' : '0px'
        }}>
          <span style={{ flex: 1, paddingRight: '15px', textAlign: 'center', lineHeight: 1.4 }}>
            {labelParts.map((part: LabelPart, index: number) => (
              <span key={index} style={{ color: part.color || '#333', fontSize: '0.95rem' }}>
                {part.text.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>{line}</span>
                ))}
              </span>
            ))}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ 
              fontWeight: (emphasize || isFinal) ? 'bold' : 'normal', 
              color: isFinal ? '#333' : (emphasize ? APP_RED : 'inherit'), 
              marginRight: '15px',
              fontSize: (emphasize) ? '1.5rem' : '0.95rem'
            }}>
              {typeof value === 'string' ? value : `¥${value.toLocaleString()}`}
            </span>
            <RedCode code={code} />
          </div>
        </div>
        {isRefund && <div style={{ fontSize: '0.8rem', color: '#333', padding: '5px 0' }}>{refundDesc[lang]}</div>}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: "'Noto Sans SC', 'Noto Sans JP', sans-serif" }}>
      <div style={{ display: 'flex', gap: '0px', marginBottom: '20px', width: '100%' }}>
        {[ { id: 'ja', label: '日本語' }, { id: 'zh-CN', label: '简体中文' }, { id: 'zh-TW', label: '繁體中文' }, { id: 'en', label: 'English' } ].map(item => (
          <button key={item.id} onClick={() => setLang(item.id as Lang)} style={{ flex: '1 1 25%', height: '40px', cursor: 'pointer', backgroundColor: lang === item.id ? '#555' : '#eee', border: '2px solid', borderColor: lang === item.id ? '#fff' : '#ccc', fontWeight: 'bold', color: lang === item.id ? '#fff' : '#000' }}>{item.label}</button>
        ))}
      </div>

      <h2 style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{titles[lang]}</h2>

      <div style={{ fontSize: '0.95rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '2px solid #888', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', flex: 1, textAlign: 'center' }}>{currentItems[0][0].text}</span>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ marginRight: '5px' }}>¥</span>
            <input type="text" value={inputValue} onChange={handleInputChange} style={{ width: '120px', padding: '5px', textAlign: 'right', fontSize: '1rem', backgroundColor: 'transparent', border: '1px solid #888', borderRadius: '4px' }} />
            <RedCode code="(a)" />
          </div>
        </div>

        <Row labelParts={currentItems[1]} value={result.b} code="(b)" />
        <Row labelParts={currentItems[2]} value={result.c} code="(c)" />
        <Row labelParts={currentItems[3]} value={result.d} code="(d)" />
        <Row labelParts={currentItems[4]} value={result.e} code="(e)" />
        <Row labelParts={currentItems[5]} value={result.f} code="(f)" isRefund={true} />
        <Row labelParts={currentItems[6]} value={result.g} code="(g)" emphasize={true} />
        <Row labelParts={currentItems[7]} value={result.h} code="(h)" isFinal={true} />
        <Row labelParts={currentItems[8]} value={result.saved} code="" />
      </div>
    </div>
  );
}

export default App;