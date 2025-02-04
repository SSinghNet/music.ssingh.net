export default function AdCard() {
    return (
        <div className="bg-black m-2 text-white rounded-xl shadow-background shadow-md drop-shadow-md text-center p-2 mt-20 flex flex-col flex-wrap justify-between">
            <h1 className="m-auto text-6xl">AD</h1>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3458168301055842"
                crossOrigin="anonymous"></script>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="fluid"
                data-ad-layout-key="-6t+ed+2i-1n-4w"
                data-ad-client="ca-pub-3458168301055842"
                data-ad-slot="5225864415"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
            </script>
        </div>
    );
}