export function getTabBarMetrics(width = 375) {
  const safeWidth = Math.max(320, Number(width) || 375);
  const buttonDiameter = Math.min(56, Math.max(46, safeWidth * 0.13));
  const buttonRadius = buttonDiameter / 2;
  const notchClearance = 8;
  const notchHalfWidth = buttonRadius + notchClearance;
  const notchDepth = buttonRadius + 6;
  const shoulderRadius = 10;
  const iconSize = Math.min(26, Math.max(20, safeWidth * 0.06));

  return {
    buttonDiameter,
    buttonRadius,
    notchHalfWidth,
    notchDepth,
    shoulderRadius,
    iconSize,
  };
}

