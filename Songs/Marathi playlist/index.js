const folder = './Songs/Marathi%20playlist';

async function getSongs() {
    const info = await fetch(folder);
    let data = await info.text();
    return data;
}

export const data2 = await getSongs();