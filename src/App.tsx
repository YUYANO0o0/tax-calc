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
        [{ text: "クーポン5%OFF\n(b)×0.95" }],
        [{ text: "【消費税10%】\n(c)×0.1" }],
        [{ text: "【手数料1.55%】\n(c)×0.0155" }],
        [{ text: "【免税額】\n(d-e)" }],
        [{ text: "【支払金額】\n5%OFF価格税込\n(c)×1.1" }],
        [{ text: "【最終価格】", color: APP_RED }, { text: "\n(g) - (f)" }],
        [{ text: "得した金額\n(a) - (h)" }]
      ],
      'zh-CN': [
        [{ text: "价格（含税）" }],
        [{ text: "价格（不含税）" }],
        [{ text: "优惠券5%OFF\n(b)×0.95" }],
        [{ text: "【消费税10%】\n(c)×0.1" }],
        [{ text: "【手续费1.55%】\n(c)×0.0155" }],
        [{ text: "【免税额】\n(d-e)" }],
        [{ text: "【支付金额】\n5%OFF含税价\n(c)×1.1" }],
        [{ text: "【最终价格】", color: APP_RED }, { text: "\n(g) - (f)" }],
        [{ text: "【省下金额】\n(a) - (h)" }]
      ],
      'zh-TW': [
        [{ text: "價格（含稅）" }],
        [{ text: "價格（不含稅）" }],
        [{ text: "優惠券5%OFF\n(b)×0.95" }],
        [{ text: "【消費稅10%】\n(c)×0.1" }],
        [{ text: "【手續稅1.55%】\n(c)×0.0155" }],
        [{ text: "【免稅額】\n(d-e)" }],
        [{ text: "【支付金額】\n5%OFF含稅價\n(c)×1.1" }],
        [{ text: "【最終價格】", color: APP_RED }, { text: "\n(g) - (f)" }],
        [{ text: "【省下金額】\n(a) - (h)" }]
      ],
      en: [
        [{ text: "Price (Tax Incl.)" }],
        [{ text: "Price (Tax Excl.)" }],
        [{ text: "Coupon 5% OFF\n(b)×0.95" }],
        [{ text: "【Tax 10%】\n(c)×0.1" }],
        [{ text: "【Fee 1.55%】\n(c)×0.0155" }],
        [{ text: "【Refund】\n(d-e)" }],
        [{ text: "【Payment】\nTax Incl. 5% OFF\n(c)×1.1" }],
        [{ text: "【Final Price】", color: APP_RED }, { text: "\n(g)-(f)" }],
        [{ text: "【Saved】\n(a)-(h)" }]
      ]
    };
    return base[lang];
  };

  const currentItems = getItems(lang);
  const titles = { 
    ja: "免税・ショッピングクーポン\n使用後の最終価格", 
    'zh-CN': "免税/购物优惠券使用后的最终价格", 
    'zh-TW': "免稅/購物優惠券使用後的最終價格", 
    en: "Final Price After Tax Exemption & Shopping Coupon" 
  };
  const refundDesc = { ja: "※免税カウンターで戻る現金", 'zh-CN': "※退税柜台退还现金", 'zh-TW': "※退稅櫃檯退還現金", en: "※Refund at counter" };

  const RedCode = ({ code }: { code: string }) => <span style={{ color: APP_RED, width: '30px', textAlign: 'right', flexShrink: 0, fontWeight: 'bold' }}>{code}</span>;

  const Row = ({ labelParts, value, code, emphasize = false, isRefund = false, isFinal = false }: any) => {
    return (
      <div style={{ padding: '8px 0', borderBottom: emphasize ? 'none' : '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ flex: 1, fontSize: '1rem', lineHeight: 1.2, fontWeight: '500' }}>
            {labelParts.map((part: LabelPart, index: number) => (
              <span key={index} style={{ color: part.color || '#333' }}>
                {part.text.split('\n').map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
              </span>
            ))}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontWeight: 'bold', color: isFinal ? '#333' : (emphasize ? APP_RED : '#333'), marginRight: '10px', fontSize: emphasize ? '1.4rem' : '1.1rem' }}>
              {typeof value === 'string' ? value : `¥${value.toLocaleString()}`}
            </span>
            <RedCode code={code} />
          </div>
        </div>
        {isRefund && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{refundDesc[lang]}</div>}
      </div>
    );
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      padding: '15px', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '450px', fontSize: '1rem' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          {[ { id: 'ja', label: '日本語' }, { id: 'zh-CN', label: '简体' }, { id: 'zh-TW', label: '繁體' }, { id: 'en', label: 'English' } ].map(item => (
            <button key={item.id} onClick={() => setLang(item.id as Lang)} style={{ flex: 1, padding: '10px 0', cursor: 'pointer', backgroundColor: lang === item.id ? '#555' : '#eee', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>{item.label}</button>
          ))}
        </div>

        <h2 style={{ fontSize: '1.25rem', textAlign: 'center', margin: '0 0 20px 0', whiteSpace: 'pre-line' }}>{titles[lang]}</h2>

        <div style={{ border: '2px solid #ccc', padding: '15px', borderRadius: '10px', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '2px solid #888', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{currentItems[0][0].text}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" value={inputValue} onChange={handleInputChange} style={{ width: '110px', textAlign: 'right', fontSize: '1.1rem', padding: '5px' }} />
              <RedCode code="(a)" />
            </div>
          </div>

          <Row labelParts={currentItems[1]} value={result.b} code="(b)" />
          <Row labelParts={currentItems[2]} value={result.c} code="(c)" />
          <Row labelParts={currentItems[3]} value={result.d} code="(d)" />
          <Row labelParts={currentItems[4]} value={result.e} code="(e)" />
          <Row labelParts={currentItems[5]} value={result.f} code="(f)" isRefund={true} />
          
          <div style={{ border: `3px solid ${APP_RED}`, padding: '10px', borderRadius: '8px', margin: '10px 0' }}>
            <Row labelParts={currentItems[6]} value={result.g} code="(g)" emphasize={true} />
          </div>
          
          <Row labelParts={currentItems[7]} value={result.h} code="(h)" isFinal={true} />
          <Row labelParts={currentItems[8]} value={result.saved} code="" />
        </div>
      </div>
    </div>
  );
}

export default App;