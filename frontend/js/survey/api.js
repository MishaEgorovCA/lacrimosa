export async function getIntro(code) {
        const res = await fetch("/get-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data.error) {
        console.log(data.error);
        return;
    }
    return data;
}