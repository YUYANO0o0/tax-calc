import { useState, useMemo } from 'react';
import './App.css';

const APP_RED = '#ff4d4d';
type Lang = 'ja' | 'zh-CN' | 'zh-TW' | 'en';
type LabelPart = { text: string; color?: string };

const getBaseData = (lang: Lang, feeRatePercent: number, useCoupon: boolean) => {
  const data: Record<Lang, LabelPart[][]> = {
    ja: [
      [{ text: "価格（税込）" }], [{ text: "価格（税抜）" }],
      [{ text: "クーポン5%OFF\n(b)×0.95" }], [{ text: "【消費税10%】\n(c)×0.1" }],
      // (23%) から赤字・装飾を完全に除去
      [{ text: "【手数料】\n消費税額×手数料率" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【免税額】\n(d-e)" }],
      [{ text: useCoupon ? "【支払金額】\n5%OFF価格税込\n(c)×1.1" : "【支払金額】" }],
      [{ text: "【最終価格】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "得した金額\n(a) - (h)" }]
    ],
    'zh-CN': [
      [{ text: "价格（含税）" }], [{ text: "价格（不含税）" }],
      [{ text: "优惠券5%OFF\n(b)×0.95" }], [{ text: "【消费税10%】\n(c)×0.1" }],
      [{ text: "【手续费】\n消费税额×手续费率" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【免税额】\n(d-e)" }],
      [{ text: useCoupon ? "【支付金额】\n5%OFF含税价\n(c)×1.1" : "【支付金额】" }],
      [{ text: "【最终价格】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "【省下金额】\n(a) - (h)" }]
    ],
    'zh-TW': [
      [{ text: "價格（含稅）" }], [{ text: "價格（不含稅）" }],
      [{ text: "優惠券5%OFF\n(b)×0.95" }], [{ text: "【消費稅10%】\n(c)×0.1" }],
      [{ text: "【手續稅】\n消費稅額×手續費率" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【免稅額】\n(d-e)" }],
      [{ text: useCoupon ? "【支付金額】\n5%OFF含稅價\n(c)×1.1" : "【支付金額】" }],
      [{ text: "【最終價格】", color: APP_RED }, { text: "\n(g) - (f)" }],
      [{ text: "【省下金額】\n(a) - (h)" }]
    ],
    en: [
      [{ text: "Price (Tax Incl.)" }], [{ text: "Price (Tax Excl.)" }],
      [{ text: "Coupon 5% OFF\n(b)×0.95" }], [{ text: "【Tax 10%】\n(c)×0.1" }],
      [{ text: "【Service Fee】\nTax Amount×Rate" }, { text: `(${feeRatePercent}%)` }],
      [{ text: "【Refund】\n(d-e)" }],
      [{ text: useCoupon ? "【Payment】\nTax Incl. 5% OFF\n(c)×1.1" : "【Payment】" }],
      [{ text: "【Final Price】", color: APP_RED }, { text: "\n(g)-(f)" }],
      [{ text: "【Saved】\n(a)-(h)" }]
    ]
  };
  return data[lang];
};

const RedCode = ({ code }: { code: string }) => (
  <span style={{ color: APP_RED, width: '30px', textAlign: 'right', flexShrink: 0, fontWeight: 'bold' }}>{code}</span>
);

const Row = ({ labelParts, value, code, emphasize = false, isRefund = false, isFinal = false, refundDesc = "", showNotice = false, isCouponRow = false, useCoupon = true, setUseCoupon = () => {}, isFeeRow = false, feeDescNode }: any) => (
  <div style={{ padding: '8px 0', borderBottom: emphasize ? 'none' : '1px solid #ddd' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ flex: 1, fontSize: '1rem', lineHeight: 1.2, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>
          {labelParts.map((part: LabelPart, idx: number) => (
            <span key={idx} style={{ color: part.color || '#333' }}>
              {part.text.split('\n').map((line: string, i: number) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
            </span>
          ))}
        </span>
        {isCouponRow && (
          <input 
            type="checkbox" 
            checked={useCoupon} 
            onChange={(e) => setUseCoupon(e.target.checked)} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        )}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontWeight: 'bold', color: isFinal ? '#333' : (emphasize ? APP_RED : '#333'), marginRight: '10px', fontSize: emphasize ? '1.6rem' : '1.1rem' }}>
          {typeof value === 'string' ? value : `¥${value.toLocaleString()}`}
        </span>
        <RedCode code={code} />
      </div>
    </div>
    {isFeeRow && (
      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
        {feeDescNode}
      </div>
    )}
    {showNotice && (
      <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '1.15rem', fontWeight: 'bold' }}>
        <span style={{ color: APP_RED }}>【免税連絡票】</span>
        <span style={{ color: '#333' }}>お渡し</span>
      </div>
    )}
    {isRefund && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{refundDesc}</div>}
  </div>
);

// 手数料率表画面（コンポーネント）
const FeeTablePage = ({ lang, onBack }: { lang: Lang; onBack: () => void }) => {
  const content = {
    ja: {
      back: "← 戻る",
      title: "【免税手数料率】",
      calcMethodTitle: "手数料\n計算方法",
      calcMethodDesc: "購入金額に応じた手数料率で\n消費税額をもとに計算",
      rateTitle: "料率",
      r1: "100万円未満",
      r2: "100万円以上300万円未満",
      r3: "300万円以上1,000万円未満",
      r4: "1,000万円以上",
      exampleTitle: "(例)",
      exampleText: "税抜500,000円（税率10%）の場合\n消費税額50,000円 × 23% ＝ 11,500円"
    },
    'zh-CN': {
      back: "← 返回",
      title: "【免税手续费率】",
      calcMethodTitle: "手续费\n计算方法",
      calcMethodDesc: "根据购买金额对应的手续费率\n基于消费税额计算",
      rateTitle: "费率",
      r1: "100万日元未满",
      r2: "100万日元以上300万日元未满",
      r3: "300万日元以上1,000万日元未满",
      r4: "1,000万日元以上",
      exampleTitle: "(例)",
      exampleText: "不含税500,000日元（税率10%）时\n消费税额50,000日元 × 23% ＝ 11,500日元"
    },
    'zh-TW': {
      back: "← 返回",
      title: "【免稅手續費率】",
      calcMethodTitle: "手續費\n計算方法",
      calcMethodDesc: "根據購買金額對應的手續費率\n基於消費稅額計算",
      rateTitle: "費率",
      r1: "100萬日圓未滿",
      r2: "100萬日圓以上300萬日圓未滿",
      r3: "300萬日圓以上1,000萬日圓未滿",
      r4: "1,000萬日圓以上",
      exampleTitle: "(例)",
      exampleText: "不含稅500,000日圓（稅率10%）時\n消費稅額50,000日圓 × 23% ＝ 11,500日圓"
    },
    en: {
      back: "← Back",
      title: "【Tax Exemption Fee Rate】",
      calcMethodTitle: "Calculation\nMethod",
      calcMethodDesc: "Calculated based on tax amount with rates\naccording to purchase price",
      rateTitle: "Rates",
      r1: "Under 1,000,000 JPY",
      r2: "1,000,000 JPY - Under 3,000,000 JPY",
      r3: "3,000,000 JPY - Under 10,000,000 JPY",
      r4: "10,000,000 JPY or more",
      exampleTitle: "(Example)",
      exampleText: "For 500,000 JPY (Tax Excl., 10% Tax Rate)\nTax Amount 50,000 JPY × 23% = 11,500 JPY"
    }
  }[lang];

  return (
    <div style={{ width: '100%', maxWidth: '450px', margin: '0 auto', fontSize: '0.95rem' }}>
      <button 
        onClick={onBack} 
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#eee', 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '15px' 
        }}
      >
        {content.back}
      </button>

      <h3 style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '15px', fontWeight: 'bold' }}>{content.title}</h3>

      <div style={{ border: '2px solid #000', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
        {/* 計算方法行 */}
        <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
          <div style={{ width: '120px', borderRight: '2px solid #000', padding: '12px 8px', backgroundColor: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', whiteSpace: 'pre-line' }}>
            {content.calcMethodTitle}
          </div>
          <div style={{ flex: 1, padding: '12px 10px', backgroundColor: '#fff', textAlign: 'center', whiteSpace: 'pre-line', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>
            {content.calcMethodDesc}
          </div>
        </div>

        {/* 料率テーブル */}
        <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
          <div style={{ width: '120px', borderRight: '2px solid #000', padding: '10px 8px', backgroundColor: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            {content.rateTitle}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', padding: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{content.r1}</span>
              <span style={{ fontWeight: 'bold' }}>23%</span>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', padding: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{content.r2}</span>
              <span style={{ fontWeight: 'bold' }}>21%</span>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', padding: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{content.r3}</span>
              <span style={{ fontWeight: 'bold' }}>18%</span>
            </div>
            <div style={{ display: 'flex', padding: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{content.r4}</span>
              <span style={{ fontWeight: 'bold' }}>16%</span>
            </div>
          </div>
        </div>

        {/* 例 */}
        <div style={{ display: 'flex' }}>
          <div style={{ width: '120px', borderRight: '2px solid #000', padding: '12px 8px', backgroundColor: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            {content.exampleTitle}
          </div>
          <div style={{ flex: 1, padding: '12px 10px', backgroundColor: '#fff', whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.5 }}>
            {content.exampleText}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [lang, setLang] = useState<Lang>('ja');
  const [inputValue, setInputValue] = useState<string>('1,100,000');
  const [useCoupon, setUseCoupon] = useState<boolean>(true);
  const [page, setPage] = useState<'calc' | 'feeTable'>('calc');

  const taxIncludedPrice = useMemo(() => Number(inputValue.replace(/,/g, '')), [inputValue]);

  const result = useMemo(() => {
    const a = taxIncludedPrice || 0;
    const b = Math.round(a / 1.1);
    
    const c = useCoupon ? Math.round(b * 0.95) : b;
    const d = Math.round(c * 0.1);

    let feeRate = 0.23;
    if (c >= 10000000) {
      feeRate = 0.16;
    } else if (c >= 3000000) {
      feeRate = 0.18;
    } else if (c >= 1000000) {
      feeRate = 0.21;
    }

    const e = Math.round(d * feeRate);
    const f = d - e;
    const g = Math.round(c * 1.1);
    const h = g - f;
    const saved = a - h;
    const feeRatePercent = Math.round(feeRate * 100);

    return { a, b, c, d, e, f, g, h, saved, feeRatePercent };
  }, [taxIncludedPrice, useCoupon]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(rawValue === '' ? '' : rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  };

  const currentItems = useMemo(() => getBaseData(lang, result.feeRatePercent, useCoupon), [lang, result.feeRatePercent, useCoupon]);
  
  const titles = { 
    ja: "免税・ショッピングクーポン\n使用後の最終価格", 
    'zh-CN': "免税/购物优惠券使用后的最终价格", 
    'zh-TW': "免稅/購物優惠券使用後的最終價格", 
    en: "Final Price After Tax Exemption & Shopping Coupon" 
  };
  
  const refundDesc = { 
    ja: "※免税される金額", 
    'zh-CN': "※免税金额", 
    'zh-TW': "※免稅金額", 
    en: "※Tax exempt amount" 
  };

  // 各言語の「手数料率」部分のみに赤字・下線・クリックイベントを付与
  const linkStyle = { color: APP_RED, textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' };
  const openTable = () => setPage('feeTable');

  const feeDescNodes: Record<Lang, React.ReactNode> = {
    ja: (
      <>※店舗、金額により<span style={linkStyle} onClick={openTable}>手数料率</span>はかわります。</>
    ),
    'zh-CN': (
      <>※根据店铺和金额，<span style={linkStyle} onClick={openTable}>手续费率</span>有所不同。</>
    ),
    'zh-TW': (
      <>※根據店舖和金額，<span style={linkStyle} onClick={openTable}>手續費率</span>有所不同。</>
    ),
    en: (
      <>*Service fee <span style={linkStyle} onClick={openTable}>rates</span> vary by store and amount.</>
    )
  };

  const footerNotices: Record<Lang, { line1: string; line2: string; line3: string }> = {
    ja: {
      line1: "購入されましたら必ず当日中に",
      line2: "免税カウンターで免税手続きをしてください。",
      line3: "※免税手続き後の返品は\n原則お断りさせていただきます。"
    },
    'zh-CN': {
      line1: "购买后请务必于当天内",
      line2: "在退税柜台办理退税手续。",
      line3: "※原则上谢绝在办理退税手续后\n进行退货。"
    },
    'zh-TW': {
      line1: "購買後請務必於當天內",
      line2: "在退稅櫃檯辦理退稅手續。",
      line3: "※原則上謝絕在辦理退稅手續後\n進行退貨。"
    },
    en: {
      line1: "Please be sure to complete tax-free procedures",
      line2: "at the tax-free counter on the same day of purchase.",
      line3: "*As a general rule, returns are not accepted\nafter tax-free procedures have been completed."
    }
  };

  const showNotice = result.b >= 1000000;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', padding: '15px', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '450px', fontSize: '1rem' }}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          {[ { id: 'ja', label: '日本語' }, { id: 'zh-CN', label: '简体' }, { id: 'zh-TW', label: '繁體' }, { id: 'en', label: 'English' } ].map(item => (
            <button key={item.id} onClick={() => setLang(item.id as Lang)} style={{ flex: 1, padding: '10px 0', cursor: 'pointer', backgroundColor: lang === item.id ? '#555' : '#eee', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>{item.label}</button>
          ))}
        </div>

        {page === 'feeTable' ? (
          <FeeTablePage lang={lang} onBack={() => setPage('calc')} />
        ) : (
          <>
            <h2 style={{ fontSize: '1.25rem', textAlign: 'center', margin: '0 0 20px 0', whiteSpace: 'pre-line' }}>{titles[lang]}</h2>

            <div style={{ border: '2px solid #ccc', padding: '15px', borderRadius: '10px', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '2px solid #888', alignItems: 'center' }}>
                <span style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{currentItems[0][0].text}</span>
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    autoCorrect="off" 
                    autoComplete="off" 
                    spellCheck={false}
                    value={inputValue} 
                    onChange={handleInputChange} 
                    style={{ width: '110px', textAlign: 'right', fontSize: '1.1rem', padding: '5px' }} 
                  />
                  <RedCode code="(a)" />
                </div>
              </div>

              <Row 
                labelParts={currentItems[1]} 
                value={result.b} 
                code="(b)" 
                showNotice={showNotice} 
              />
              
              <Row 
                labelParts={currentItems[2]} 
                value={result.c} 
                code="(c)" 
                isCouponRow={true} 
                useCoupon={useCoupon} 
                setUseCoupon={setUseCoupon} 
              />

              <Row labelParts={currentItems[3]} value={result.d} code="(d)" />
              
              <Row 
                labelParts={currentItems[4]} 
                value={result.e} 
                code="(e)" 
                isFeeRow={true} 
                feeDescNode={feeDescNodes[lang]} 
              />
              
              <Row labelParts={currentItems[5]} value={result.f} code="(f)" isRefund={true} refundDesc={refundDesc[lang]} />
              
              <div style={{ border: `3px solid ${APP_RED}`, padding: '10px', borderRadius: '8px', margin: '10px 0' }}>
                <Row labelParts={currentItems[6]} value={result.g} code="(g)" emphasize={true} />
              </div>
              
              <Row labelParts={currentItems[7]} value={result.h} code="(h)" isFinal={true} />
              <Row labelParts={currentItems[8]} value={result.saved} code="" />

              <div style={{ marginTop: '18px', borderTop: '1px solid #ddd', paddingTop: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#333', lineHeight: 1.5, marginBottom: '8px' }}>
                  <div>{footerNotices[lang].line1}</div>
                  <div>{footerNotices[lang].line2}</div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: APP_RED, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {footerNotices[lang].line3}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;