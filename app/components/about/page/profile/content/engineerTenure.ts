/** エンジニア開始日から「X年 Y日」を算出（表示用） */

export function getEngineerTenure(
  sinceIso: string,
  now: Date = new Date(),
): { years: number; days: number } {
  const since = new Date(sinceIso);
  const start = new Date(since.getFullYear(), since.getMonth(), since.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let years = end.getFullYear() - start.getFullYear();
  const anniversaryThisYear = new Date(end.getFullYear(), start.getMonth(), start.getDate());
  if (end < anniversaryThisYear) years -= 1;

  const lastAnniversary = new Date(
    end.getFullYear() - (end < anniversaryThisYear ? 1 : 0),
    start.getMonth(),
    start.getDate(),
  );
  const days = Math.round((end.getTime() - lastAnniversary.getTime()) / 86_400_000);

  return { years: Math.max(0, years), days: Math.max(0, days) };
}
