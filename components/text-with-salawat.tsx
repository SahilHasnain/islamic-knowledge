type TextWithSalawatProps = {
  text: string;
};

export function TextWithSalawat({ text }: TextWithSalawatProps) {
  const parts = text.split("ﷺ");

  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? (
        <sup className="mx-1 inline-block align-super font-serif text-[0.7em] leading-none" dir="rtl">
          ﷺ
        </sup>
      ) : null}
    </span>
  ));
}
