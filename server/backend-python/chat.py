from flask import Blueprint, request, jsonify
from src.models.chat import ChatSession, ChatMessage, db
from src.services.rag_service import RAGService
import json

chat_bp = Blueprint('chat', __name__)
rag_service = RAGService()

@chat_bp.route('/chat/sessions', methods=['GET'])
def get_chat_sessions():
    """Get all chat sessions for a user"""
    user_id = request.args.get('user_id', 1)  # Default user for now
    sessions = ChatSession.query.filter_by(user_id=user_id).order_by(ChatSession.updated_at.desc()).all()
    return jsonify([session.to_dict() for session in sessions])

@chat_bp.route('/chat/sessions', methods=['POST'])
def create_chat_session():
    """Create a new chat session"""
    data = request.get_json()
    user_id = data.get('user_id', 1)  # Default user for now
    title = data.get('title', 'New Chat')
    
    session = ChatSession(user_id=user_id, title=title)
    db.session.add(session)
    db.session.commit()
    
    return jsonify(session.to_dict()), 201

@chat_bp.route('/chat/sessions/<int:session_id>/messages', methods=['GET'])
def get_chat_messages(session_id):
    """Get all messages in a chat session"""
    messages = ChatMessage.query.filter_by(session_id=session_id).order_by(ChatMessage.timestamp.asc()).all()
    return jsonify([message.to_dict() for message in messages])

@chat_bp.route('/chat/sessions/<int:session_id>/messages', methods=['POST'])
def send_message(session_id):
    """Send a message and get AI response"""
    data = request.get_json()
    user_message = data.get('message', '')
    use_rag = data.get('use_rag', True)
    
    if not user_message.strip():
        return jsonify({'error': 'Message cannot be empty'}), 400
    
    try:
        # Save user message
        user_msg = ChatMessage(
            session_id=session_id,
            role='user',
            content=user_message
        )
        db.session.add(user_msg)
        
        # Generate AI response
        if use_rag:
            rag_result = rag_service.generate_answer(user_message)
            ai_response = rag_result['answer']
            sources = json.dumps(rag_result['sources'])
            confidence = rag_result['confidence']
        else:
            from src.services.ai_service import AIService
            ai_service = AIService()
            result = ai_service.generate_with_gemini(user_message)
            ai_response = result.get('response', result.get('error', 'เกิดข้อผิดพลาดในการสร้างคำตอบ'))
            sources = None
            confidence = None
        
        # Save AI response
        ai_msg = ChatMessage(
            session_id=session_id,
            role='assistant',
            content=ai_response,
            sources=sources,
            confidence_score=confidence
        )
        db.session.add(ai_msg)
        
        # Update session timestamp
        session = ChatSession.query.get(session_id)
        if session:
            session.updated_at = db.func.now()
        
        db.session.commit()
        
        return jsonify({
            'user_message': user_msg.to_dict(),
            'ai_response': ai_msg.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/chat/rag/documents', methods=['POST'])
def add_rag_document():
    """Add document to RAG system"""
    data = request.get_json()
    text = data.get('text', '')
    metadata = data.get('metadata', {})
    
    if not text.strip():
        return jsonify({'error': 'Text cannot be empty'}), 400
    
    success = rag_service.add_document(text, metadata)
    if success:
        return jsonify({'message': 'Document added successfully'})
    else:
        return jsonify({'error': 'Failed to add document'}), 500

@chat_bp.route('/chat/rag/documents/batch', methods=['POST'])
def add_rag_documents_batch():
    """Add multiple documents to RAG system"""
    data = request.get_json()
    documents = data.get('documents', [])
    
    if not documents:
        return jsonify({'error': 'No documents provided'}), 400
    
    success_count = rag_service.add_documents_batch(documents)
    return jsonify({
        'message': f'Added {success_count} out of {len(documents)} documents',
        'success_count': success_count,
        'total_count': len(documents)
    })

@chat_bp.route('/chat/rag/search', methods=['POST'])
def search_rag():
    """Search RAG system"""
    data = request.get_json()
    query = data.get('query', '')
    k = data.get('k', 5)
    
    if not query.strip():
        return jsonify({'error': 'Query cannot be empty'}), 400
    
    results = rag_service.search(query, k)
    return jsonify(results)

@chat_bp.route('/chat/rag/stats', methods=['GET'])
def get_rag_stats():
    """Get RAG system statistics"""
    stats = rag_service.get_stats()
    return jsonify(stats)

@chat_bp.route('/chat/rag/clear', methods=['POST'])
def clear_rag():
    """Clear RAG system"""
    success = rag_service.clear_index()
    if success:
        return jsonify({'message': 'RAG system cleared successfully'})
    else:
        return jsonify({'error': 'Failed to clear RAG system'}), 500

