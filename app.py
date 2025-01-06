from flask import Flask, render_template, request, send_file
from PIL import Image
import io

app = Flask(__name__)

# Route to render the HTML page
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle the image resizing
@app.route('/resize', methods=['POST'])
def resize_image():
    try:
        # Get the uploaded image file
        image_file = request.files['image']
        
        # Get the width, height, and quality from the form
        width = int(request.form['width'])
        height = int(request.form['height'])
        quality = int(request.form['quality'])

        # Open the image
        img = Image.open(image_file)

        # Resize the image
        img_resized = img.resize((width, height))

        # Save the resized image to a BytesIO object (to send back without saving to disk)
        img_io = io.BytesIO()
        img_resized.save(img_io, 'JPEG', quality=quality)
        img_io.seek(0)

        # Return the image as a downloadable file
        return send_file(img_io, mimetype='image/jpeg', as_attachment=True, download_name="resized_image.jpg")

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    app.run(debug=True)
