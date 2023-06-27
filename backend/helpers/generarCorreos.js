
export const generarCorreos= (nombre, apellido) => {
    const correos = {};
  
    jsonData.forEach((obj) => {
      const nombre = obj.nombre.toLowerCase().trim();
      const apellido = obj.apellido.toLowerCase().trim();
      const correo = `${nombre}.${apellido}@unah.hn`;
  
      if (!correos[correo]) {
        correos[correo] = true;
      }
    });
  
    const correosUnicos = Object.keys(correos);
  
    const correosJson = correosUnicos.map((correo) => {
      return { correo };
    });
  
    return correosJson;
  }