export function adjustSVGSize(
  svgString: string,
  width: string,
  height: string
) {
  let adjustedSvg = svgString
    .replace(/width="[^"]*"/, `width="${width}"`)
    .replace(/height="[^"]*"/, `height="${height}"`);

  adjustedSvg = adjustedSvg
    // .replace(/fill="[^"]*"/g, 'fill="currentColor"')
    .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');

  return adjustedSvg;
}

export default function SVGComponent({
  width = "24",
  height = "24",
  icon,
}: {
  width?: string;
  height?: string;
  icon: string | null;
}) {
  if (icon == null) return "---";
  const sizedSvg = adjustSVGSize(icon, width || "30", height || "30");

  return (
    <div
      style={{
        width: width || "100%",
        height: height || "auto",
        maxWidth: "100%",
        display: "inline",
      }}
      dangerouslySetInnerHTML={{ __html: sizedSvg }}
    />
  );
}
