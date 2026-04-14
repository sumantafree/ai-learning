from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.note import NoteCreate, NoteUpdate, NoteOut, SummarizeRequest
from services import note_service, ai_service
from core.dependencies import get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.create_note(db, current_user.id, data)


@router.get("/", response_model=list[NoteOut])
def list_notes(
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.get_notes(db, current_user.id, search=search, skip=skip, limit=limit)


@router.get("/{note_id}", response_model=NoteOut)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note_service.update_note(db, note, data)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note_service.delete_note(db, note)


@router.post("/{note_id}/summarize", response_model=NoteOut)
def summarize_note(
    note_id: int,
    req: SummarizeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = note_service.get_note(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    result = ai_service.summarize_note(
        title=note.title,
        content=note.content,
        provider=req.provider,
    )
    # Store summary; optionally append suggested tags
    summary_text = result["summary"]
    if result.get("key_points"):
        summary_text += "\n\nKey Points:\n" + "\n".join(f"• {p}" for p in result["key_points"])

    if result.get("suggested_tags") and not note.tags:
        note_service.update_note(
            db, note,
            NoteUpdate(tags=", ".join(result["suggested_tags"]))
        )

    return note_service.set_ai_summary(db, note, summary_text)
