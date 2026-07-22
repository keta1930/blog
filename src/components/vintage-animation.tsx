import type { SiteLocale } from '@/lib/i18n';

const dialMarks = Array.from({ length: 12 }, (_, index) => (
  <span key={index} style={{ '--mark': index } as React.CSSProperties} />
));

export function VintageAnimation({ locale }: { locale: SiteLocale }) {
  const isChinese = locale === 'zh';

  return (
    <div className="vintage-visual" aria-hidden="true">
      <div className="vintage-caption">
        <span>{isChinese ? '田野观察' : 'FIELD OBSERVATION'}</span>
        <span>{isChinese ? '第 07 号' : '№ 07'}</span>
      </div>
      <div className="vintage-instrument">
        <div className="dial-marks">{dialMarks}</div>
        <div className="orbit orbit-outer"><span /></div>
        <div className="orbit orbit-inner"><span /></div>
        <div className="dial-center">
          <span className="center-star">✦</span>
          <small>{isChinese ? '重访' : 'RETURN'}</small>
        </div>
        <div className="dial-needle" />
      </div>
      <p>
        {isChinese ? <>想法不断回旋<br />直到找到自己的形状。</> : <>Ideas move in circles<br />until they find a form.</>}
      </p>
    </div>
  );
}
