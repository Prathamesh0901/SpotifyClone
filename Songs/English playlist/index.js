const folder = './Songs/English%20playlist';

async function getSongs() {
    const info = await fetch(folder);
    let data = await info.text();
    return data;
}

export const data0 = await getSongs();