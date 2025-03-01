import React from "react";

const ReceiptComponent = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} style={{ width: "250px", fontFamily: "monospace", padding: "10px" }}>
            <h3 style={{ textAlign: "center" }}>TOKO ABC</h3>
            <p style={{ borderBottom: "1px dashed black", paddingBottom: "5px" }}>
                17 Februari 2025 | 12:30 PM
            </p>
            <table style={{ width: "100%", fontSize: "14px" }}>
                <tbody>
                    <tr>
                        <td>Produk A</td>
                        <td style={{ textAlign: "right" }}>Rp10.000</td>
                    </tr>
                    <tr>
                        <td>Produk B</td>
                        <td style={{ textAlign: "right" }}>Rp20.000</td>
                    </tr>
                </tbody>
            </table>
            <p style={{ borderTop: "1px dashed black", paddingTop: "5px" }}>
                <strong>Total: Rp30.000</strong>
            </p>
            <p style={{ marginTop: "10px", fontSize: "12px", textAlign: "center" }}>
                Terima kasih telah berbelanja!
            </p>
        </div>
    );
});

export default ReceiptComponent;
