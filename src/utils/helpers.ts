
export async function convertImageToFileURL(imageFile: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        if (event.target) {
          const dataURL = event.target.result as string;
          resolve(dataURL);
        } else {
          reject(new Error('Failed to read the file.'));
        }
      };
  
      reader.onerror = (event) => {
        reject(new Error('Failed to read the file: ' + event.target?.error));
      };
  
      reader.readAsDataURL(imageFile);
    });
  }



  export type PType = {
    RMP: string,
    FFP: string,
    FP: string,
    DP: string,
    ABP: string,
  }
  
  export const productTypes = (key: string) => {
    switch (key) {
      case "RMP": return "Xomashyo mahsulot"
      case "FFP": return "Tayyor mato"
      case "FP": return "Tayyor mahsulot"
      case "DP": return "Dekorativ mahsulot"
      case "ABP": return "Aktiv ko'rpachalik mahsulot"
    }
  }