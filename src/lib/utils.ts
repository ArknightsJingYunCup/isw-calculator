
export async function saveJson(content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export async function readJson(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.accept = '.json';
    input.multiple = false;

    input.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (typeof e.target?.result === 'string') {
            resolve(e.target?.result);
          } else {
            reject(new Error("Failed to read the file"));
          }
        };
        reader.readAsText(file); // You can use readAsDataURL or readAsArrayBuffer as needed
      }

    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  })
}

export type EnumLike = Record<string, string | number>;
export type StringEnum = Record<string, string>;
export function enumKeys<E extends EnumLike>(e: E): (keyof E)[] {
  return Object.keys(e)
    .filter(key => isNaN(Number(key)))
    .map(key => key as keyof E); // 只保留名字（跳过反向映射的数字key）
}
export function enumValues<E extends EnumLike>(e: E): E[keyof E][] {
  return Object.values(e) as E[keyof E][];
}