import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600;700&display=swap"
                        rel="stylesheet"
                    />
                    {/* <link
                        href="https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&display=swap"
                        rel="stylesheet"
                    /> */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap"
                        rel="stylesheet"
                    />

                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                        rel="stylesheet"
                    />

                    <link
                        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
