import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
import base64
from io import BytesIO
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from flask import send_file, make_response
from PIL import Image as PilImage
from vobject import vCard
import logging
from datetime import datetime

# Configuración básica de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def export_to_pdf(data, filename):
    """
    Exporta datos a un archivo PDF.

    Parámetros:
    - data (list of dict): Lista de diccionarios con los datos.
    - filename (str): Nombre del archivo de salida.

    Retorna:
    - flask.Response: Una respuesta de Flask para enviar el archivo.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Título del documento
    story.append(Paragraph("Reporte de Datos", styles['Title']))
    story.append(Spacer(1, 0.2 * inch))

    # Contenido del documento (un párrafo por cada elemento de los datos)
    for item in data:
        # Aquí puedes personalizar el formato del contenido.
        # Por ejemplo, un párrafo con cada clave y valor.
        paragraph_text = ""
        for key, value in item.items():
            paragraph_text += f"<b>{key.capitalize()}:</b> {value}<br/>"
        story.append(Paragraph(paragraph_text, styles['Normal']))
        story.append(Spacer(1, 0.1 * inch))

    doc.build(story)
    buffer.seek(0)
    
    response = make_response(send_file(buffer, as_attachment=True, download_name=filename, mimetype='application/pdf'))
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    return response

def export_to_jpg(data, filename):
    """
    Genera una imagen JPG a partir de datos de texto.
    Esto es una implementación básica, genera una imagen con texto simple.

    Parámetros:
    - data (list of dict): Lista de diccionarios con los datos.
    - filename (str): Nombre del archivo de salida.

    Retorna:
    - flask.Response: Una respuesta de Flask para enviar el archivo.
    """
    try:
        # Convertir datos a una cadena de texto para la imagen
        text_content = ""
        for item in data:
            for key, value in item.items():
                text_content += f"{key.capitalize()}: {value}\n"
            text_content += "---------------------\n"

        # Crear una imagen en memoria
        from PIL import Image, ImageDraw, ImageFont
        
        # Tamaño inicial de la imagen
        img_width = 800
        img_height = 600

        # Crear una imagen blanca
        img = Image.new('RGB', (img_width, img_height), color='white')
        d = ImageDraw.Draw(img)

        # Usar una fuente por defecto (se puede mejorar)
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except IOError:
            logging.warning("No se encontró la fuente 'arial.ttf', usando la fuente por defecto de PIL.")
            font = ImageFont.load_default()

        # Dibujar el texto en la imagen
        d.text((10, 10), text_content, fill='black', font=font)

        buffer = BytesIO()
        img.save(buffer, format='JPEG')
        buffer.seek(0)

        response = make_response(send_file(buffer, as_attachment=True, download_name=filename, mimetype='image/jpeg'))
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    except Exception as e:
        logging.error(f"Error al exportar a JPG: {e}")
        # Aquí puedes retornar un error o un archivo predeterminado de error
        return make_response("Error al generar la imagen.", 500)


def export_to_xls(data, filename):
    """
    Exporta una lista de diccionarios a un archivo de Excel (.xls o .xlsx).

    Parámetros:
    - data (list of dict): Lista de diccionarios con los datos.
    - filename (str): Nombre del archivo de salida.

    Retorna:
    - flask.Response: Una respuesta de Flask para enviar el archivo.
    """
    try:
        df = pd.DataFrame(data)
        buffer = BytesIO()
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Sheet1')
        buffer.seek(0)
        
        response = make_response(send_file(buffer, as_attachment=True, download_name=filename, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    except Exception as e:
        logging.error(f"Error al exportar a XLS: {e}")
        return make_response("Error al generar el archivo Excel.", 500)

def export_to_vcard(data, filename):
    """
    Exporta datos de contacto a un archivo VCard (.vcf).
    Se asume que 'data' es un solo diccionario de contacto.

    Parámetros:
    - data (dict): Diccionario con los datos del contacto.
    - filename (str): Nombre del archivo de salida.

    Retorna:
    - flask.Response: Una respuesta de Flask para enviar el archivo.
    """
    try:
        vcard_obj = vCard()
        vcard_obj.add('fn').value = data.get('nombre', '') + ' ' + data.get('apellido', '')
        vcard_obj.add('n').value = vobject.vCard.Name(family=data.get('apellido', ''), given=data.get('nombre', ''))
        vcard_obj.add('tel').value = data.get('telefono', '')
        vcard_obj.add('email').value = data.get('email', '')
        vcard_obj.add('note').value = data.get('nota', '')

        buffer = BytesIO(vcard_obj.serialize().encode('utf-8'))
        buffer.seek(0)
        
        response = make_response(send_file(buffer, as_attachment=True, download_name=filename, mimetype='text/vcard'))
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    except Exception as e:
        logging.error(f"Error al exportar a VCard: {e}")
        return make_response("Error al generar el archivo VCard.", 500)
