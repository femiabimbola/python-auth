"""rename verification token to code

Revision ID: f1d5ba6ad456
Revises: db6a58e8521b
Create Date: 2026-09-26 11:31:21.644573

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f1d5ba6ad456'
down_revision: Union[str, Sequence[str], None] = 'db6a58e8521b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Safely rename the table
    op.rename_table('email_verification_tokens', 'email_verification_codes')

    # 2. CLEAR the old, incompatible long tokens before resizing
    # This prevents the StringDataRightTruncation error.
    op.execute("DELETE FROM email_verification_codes")

    # 3. Safely rename the column and change length to 6
    op.alter_column(
        'email_verification_codes',
        'token',
        new_column_name='code',
        existing_type=sa.String(length=255),
        type_=sa.String(length=6),
        existing_nullable=False
    )

    # 4. Update the indexes for the new column name
    op.drop_index('ix_email_verification_tokens_token', table_name='email_verification_codes')
    op.create_index(op.f('ix_email_verification_codes_code'), 'email_verification_codes', ['code'], unique=False)

    # 5. Apply the refresh_tokens updates Alembic detected
    op.create_index(op.f('ix_refresh_tokens_expires_at'), 'refresh_tokens', ['expires_at'], unique=False)
    op.create_index(op.f('ix_refresh_tokens_user_id'), 'refresh_tokens', ['user_id'], unique=False)
    
def downgrade() -> None:
    # 1. Reverse the refresh_tokens updates
    op.drop_index(op.f('ix_refresh_tokens_user_id'), table_name='refresh_tokens')
    op.drop_index(op.f('ix_refresh_tokens_expires_at'), table_name='refresh_tokens')

    # 2. Reverse the indexes back to unique tokens
    op.drop_index(op.f('ix_email_verification_codes_code'), table_name='email_verification_codes')
    op.create_index('ix_email_verification_tokens_token', 'email_verification_codes', ['code'], unique=True)
    
    # 3. Reverse the column rename
    op.alter_column(
        'email_verification_codes',
        'code',
        new_column_name='token',
        existing_type=sa.String(length=6),
        type_=sa.String(length=255),
        existing_nullable=False
    )
    
    # 4. Reverse the table rename
    op.rename_table('email_verification_codes', 'email_verification_tokens')

    # ⚠️ WARNING: If you uncommented the drop_table commands in upgrade(), 
    # you would need to paste the create_table commands for user_profiles here to reverse it.