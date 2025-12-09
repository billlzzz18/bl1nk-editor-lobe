from flask import Blueprint, request, jsonify, send_file
import os
import json
import uuid
import markdown
import tempfile
from datetime import datetime
from src.models.user import db
from src.models.enhanced_models import WorkItem, SharedContent
from src.config import Config

sharing_bp = Blueprint('sharing', __name__)

@sharing_bp.route('/share', methods=['POST'])
def share_content():
    """Share content to various formats"""
    try:
        data = request.get_json()
        content_type = data.get('content_type', 'text')
        content = data.get('content', '')
        title = data.get('title', f'Shared content {datetime.now().strftime("%Y-%m-%d %H:%M")}')
        format = data.get('format', 'md')  # md, html, docx, pdf, url
        user_id = data.get('user_id', 1)
        source_id = data.get('source_id')
        source_type = data.get('source_type', 'chat')
        
        # Create a unique ID for this shared content
        share_id = str(uuid.uuid4())
        
        # Create directory for shared content if it doesn't exist
        shared_dir = os.path.join(Config.UPLOAD_FOLDER, 'shared')
        os.makedirs(shared_dir, exist_ok=True)
        
        # Path for the shared content
        file_path = None
        public_url = None
        
        # Process based on requested format
        if format == 'md':
            # Save as Markdown
            file_path = os.path.join(shared_dir, f"{share_id}.md")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"# {title}\n\n")
                f.write(content)
                
        elif format == 'html':
            # Convert to HTML
            html_content = markdown.markdown(content)
            file_path = os.path.join(shared_dir, f"{share_id}.html")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"<!DOCTYPE html><html><head><title>{title}</title></head><body>")
                f.write(f"<h1>{title}</h1>")
                f.write(html_content)
                f.write("</body></html>")
                
        elif format == 'docx':
            # For DOCX, we'd typically use a library like python-docx
            # This is a simplified version
            file_path = os.path.join(shared_dir, f"{share_id}.txt")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"{title}\n\n")
                f.write(content)
            
        elif format == 'pdf':
            # For PDF, we'd typically use a library like ReportLab or WeasyPrint
            # This is a simplified version
            file_path = os.path.join(shared_dir, f"{share_id}.txt")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"{title}\n\n")
                f.write(content)
            
        elif format == 'url':
            # Generate a shareable URL
            public_url = f"/api/shared/{share_id}"
            file_path = os.path.join(shared_dir, f"{share_id}.json")
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'title': title,
                    'content': content,
                    'content_type': content_type,
                    'created_at': datetime.now().isoformat()
                }, f)
        
        # Save sharing record to database
        shared_content = SharedContent(
            share_id=share_id,
            user_id=user_id,
            title=title,
            format=format,
            file_path=file_path,
            public_url=public_url,
            source_id=source_id,
            source_type=source_type
        )
        
        db.session.add(shared_content)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'share_id': share_id,
            'file_path': file_path,
            'public_url': public_url,
            'format': format
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to share content: {str(e)}'}), 500

@sharing_bp.route('/shared/<share_id>', methods=['GET'])
def get_shared_content(share_id):
    """Get shared content by ID"""
    try:
        shared_content = SharedContent.query.filter_by(share_id=share_id).first()
        
        if not shared_content:
            return jsonify({'error': 'Shared content not found'}), 404
        
        # If it's a URL share, return the content
        if shared_content.format == 'url':
            with open(shared_content.file_path, 'r', encoding='utf-8') as f:
                content_data = json.load(f)
                
            return jsonify({
                'share_id': share_id,
                'title': shared_content.title,
                'content': content_data.get('content', ''),
                'content_type': content_data.get('content_type', 'text'),
                'created_at': shared_content.created_at.isoformat() if shared_content.created_at else None
            }), 200
        
        # For file formats, return the file
        if os.path.exists(shared_content.file_path):
            return send_file(shared_content.file_path, as_attachment=True, 
                            download_name=f"{shared_content.title}.{shared_content.format}")
        
        return jsonify({'error': 'Shared file not found'}), 404
        
    except Exception as e:
        return jsonify({'error': f'Failed to get shared content: {str(e)}'}), 500

@sharing_bp.route('/shared', methods=['GET'])
def list_shared_content():
    """List all shared content for a user"""
    try:
        user_id = request.args.get('user_id', 1, type=int)
        
        shared_items = SharedContent.query.filter_by(user_id=user_id)\
                                    .order_by(SharedContent.created_at.desc())\
                                    .all()
        
        return jsonify({
            'shared_items': [item.to_dict() for item in shared_items],
            'total': len(shared_items)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to list shared content: {str(e)}'}), 500

@sharing_bp.route('/shared/<share_id>', methods=['DELETE'])
def delete_shared_content(share_id):
    """Delete shared content"""
    try:
        shared_content = SharedContent.query.filter_by(share_id=share_id).first()
        
        if not shared_content:
            return jsonify({'error': 'Shared content not found'}), 404
        
        # Delete the file if it exists
        if shared_content.file_path and os.path.exists(shared_content.file_path):
            os.remove(shared_content.file_path)
        
        # Delete the database record
        db.session.delete(shared_content)
        db.session.commit()
        
        return jsonify({'message': 'Shared content deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete shared content: {str(e)}'}), 500

@sharing_bp.route('/embed', methods=['POST'])
def create_embed():
    """Create an embeddable version of content"""
    try:
        data = request.get_json()
        content_type = data.get('content_type', 'text')
        content = data.get('content', '')
        title = data.get('title', f'Embedded content {datetime.now().strftime("%Y-%m-%d %H:%M")}')
        user_id = data.get('user_id', 1)
        
        # Create a unique ID for this embedded content
        embed_id = str(uuid.uuid4())
        
        # Create directory for embedded content if it doesn't exist
        embed_dir = os.path.join(Config.UPLOAD_FOLDER, 'embeds')
        os.makedirs(embed_dir, exist_ok=True)
        
        # Create the embed HTML
        embed_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{title}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; }}
                .embed-container {{ padding: 20px; }}
                h1 {{ color: #333; }}
                pre {{ background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }}
            </style>
        </head>
        <body>
            <div class="embed-container">
                <h1>{title}</h1>
                <div class="content">
                    {markdown.markdown(content) if content_type == 'text' else content}
                </div>
            </div>
        </body>
        </html>
        """
        
        # Save the embed HTML
        file_path = os.path.join(embed_dir, f"{embed_id}.html")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(embed_html)
        
        # Generate embed code
        embed_code = f'<iframe src="/api/embed/{embed_id}" width="100%" height="500" frameborder="0"></iframe>'
        
        # Save embed record to database
        shared_content = SharedContent(
            share_id=embed_id,
            user_id=user_id,
            title=title,
            format='embed',
            file_path=file_path,
            public_url=f"/api/embed/{embed_id}"
        )
        
        db.session.add(shared_content)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'embed_id': embed_id,
            'embed_url': f"/api/embed/{embed_id}",
            'embed_code': embed_code
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create embed: {str(e)}'}), 500

@sharing_bp.route('/embed/<embed_id>', methods=['GET'])
def get_embed(embed_id):
    """Get embedded content by ID"""
    try:
        shared_content = SharedContent.query.filter_by(share_id=embed_id, format='embed').first()
        
        if not shared_content:
            return jsonify({'error': 'Embedded content not found'}), 404
        
        # Return the embed HTML file
        if os.path.exists(shared_content.file_path):
            return send_file(shared_content.file_path)
        
        return jsonify({'error': 'Embedded file not found'}), 404
        
    except Exception as e:
        return jsonify({'error': f'Failed to get embedded content: {str(e)}'}), 500

