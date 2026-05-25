import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

export async function sendWelcomeEmail(nombre: string, email: string) {
  await resend.emails.send({
    from: `Moda Store <${FROM}>`,
    to: email,
    subject: 'Bienvenido/a a Moda Store',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#000;font-family:Inter,system-ui,sans-serif;color:#fff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:48px 16px;">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
                  <tr>
                    <td style="border-bottom:1px solid #222;padding-bottom:24px;margin-bottom:32px;">
                      <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">
                        MODA-STORE
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:32px;">
                      <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#555;">
                        Bienvenido/a
                      </p>
                      <h1 style="margin:0 0 24px;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.1;">
                        Hola, ${nombre}
                      </h1>
                      <p style="margin:0 0 32px;font-size:14px;line-height:1.6;color:#aaa;">
                        Tu cuenta en Moda Store fue creada exitosamente.<br>
                        Podés empezar a explorar la nueva colección.
                      </p>
                      <a href="${process.env.FRONTEND_URL ?? 'http://localhost:5173'}"
                        style="display:inline-block;background:#fff;color:#000;text-decoration:none;padding:14px 32px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">
                        Ver colección
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:48px;border-top:1px solid #222;margin-top:48px;">
                      <p style="margin:0;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:0.1em;">
                        © 2025 Moda Store
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

export async function sendOrderConfirmationEmail(
  nombre: string,
  email: string,
  ordenId: number,
  total: number,
  items: { nombre: string; talle: string; cantidad: number; precio: number }[]
) {
  const formatPrice = (n: number) =>
    '$ ' + new Intl.NumberFormat('es-UY', { minimumFractionDigits: 0 }).format(n);

  const itemsHtml = items
    .map(
      i => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#ccc;">
          ${i.nombre} <span style="color:#555;font-size:11px;">— T: ${i.talle}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#ccc;text-align:right;white-space:nowrap;">
          ${i.cantidad} × ${formatPrice(i.precio)}
        </td>
      </tr>`
    )
    .join('');

  await resend.emails.send({
    from: `Moda Store <${FROM}>`,
    to: email,
    subject: `Orden #${String(ordenId).padStart(4, '0')} confirmada`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#000;font-family:Inter,system-ui,sans-serif;color:#fff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:48px 16px;">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
                  <tr>
                    <td style="border-bottom:1px solid #222;padding-bottom:24px;">
                      <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">
                        MODA-STORE
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:32px;">
                      <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#555;">
                        Orden confirmada
                      </p>
                      <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.1;">
                        #${String(ordenId).padStart(4, '0')}
                      </h1>
                      <p style="margin:0 0 32px;font-size:14px;color:#aaa;">
                        Gracias, ${nombre}. Tu pedido fue recibido.
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        ${itemsHtml}
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-top:16px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#555;">
                            Total
                          </td>
                          <td style="padding-top:16px;font-size:20px;font-weight:700;text-align:right;">
                            ${formatPrice(total)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:48px;border-top:1px solid #222;">
                      <p style="margin:0;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:0.1em;">
                        © 2025 Moda Store
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
