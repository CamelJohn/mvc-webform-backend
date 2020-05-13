
  const mergeBlobAndServiceReq = (sr, blob) => {
    let merged = [];
    sr.map((ssr, id) => {
      if (ssr.id === blob[id].srId) {
        merged.push({ ...ssr, blobName: blob[id].blobName, containerName: b[id].containerName })
      } else {
        merged.push({ ...ssr, blobName: null, containerName: null })
      }
    })
    return merged;
  }
  
  module.exports = { mergeBlobAndServiceReq };
