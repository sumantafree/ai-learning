from typing import Optional
from sqlalchemy.orm import Session
from models.note import Note
from schemas.note import NoteCreate, NoteUpdate


def create_note(db: Session, owner_id: int, data: NoteCreate) -> Note:
    note = Note(owner_id=owner_id, **data.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def get_note(db: Session, note_id: int, owner_id: int) -> Optional[Note]:
    return db.query(Note).filter(Note.id == note_id, Note.owner_id == owner_id).first()


def get_notes(
    db: Session,
    owner_id: int,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> list[Note]:
    query = db.query(Note).filter(Note.owner_id == owner_id)
    if search:
        like = f"%{search}%"
        query = query.filter(
            Note.title.ilike(like) | Note.content.ilike(like) | Note.tags.ilike(like)
        )
    return query.order_by(Note.updated_at.desc()).offset(skip).limit(limit).all()


def update_note(db: Session, note: Note, data: NoteUpdate) -> Note:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(note, field, value)
    db.commit()
    db.refresh(note)
    return note


def set_ai_summary(db: Session, note: Note, summary: str) -> Note:
    note.ai_summary = summary
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note: Note) -> None:
    db.delete(note)
    db.commit()
