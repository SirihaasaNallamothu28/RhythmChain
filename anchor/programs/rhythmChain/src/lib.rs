#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod rhythmChain {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializeRhythmChain>,
        file_name: String,
        file_author: String,
        file_timestamp: u64,
        file_length: u64,
        file_hash: String,
    ) -> Result<()> {
        // Store the user's public key as the owner of this music record
        ctx.accounts.rhythmChain.owner = ctx.accounts.signer.key();
        ctx.accounts.rhythmChain.file_name = file_name;
        ctx.accounts.rhythmChain.file_author = file_author;
        ctx.accounts.rhythmChain.file_timestamp = file_timestamp;
        ctx.accounts.rhythmChain.file_length = file_length;
        ctx.accounts.rhythmChain.file_hash = file_hash;
        
        msg!("RhythmChain initialized with values: {:?}", ctx.accounts.rhythmChain);
        Ok(())
    }

    pub fn verify_music(ctx: Context<VerifyMusic>, file_hash: String) -> Result<()> {
        // The verification will happen client-side by comparing the owner
        // This function just fetches the record
        let music_record = &ctx.accounts.rhythmChain;
        
        // Emit an event with verification info
        emit!(MusicVerified {
            hash: music_record.file_hash.clone(),
            owner: music_record.owner,
            is_authentic: true,
            file_name: music_record.file_name.clone(),
            file_author: music_record.file_author.clone(),
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(file_name: String, file_author: String, file_timestamp: u64, file_length: u64, file_hash: String)]
pub struct InitializeRhythmChain<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        init,
        space = 8 + RhythmChain::INIT_SPACE,
        payer = signer,
        // Use the file hash as the seed to create a unique PDA for each music file
        seeds = [file_hash.as_bytes()],
        bump
    )]
    pub rhythmChain: Account<'info, RhythmChain>,
    pub system_program: Program<'info, System>,
}

// New account context for verification
#[derive(Accounts)]
#[instruction(file_hash: String)]
pub struct VerifyMusic<'info> {
    #[account(
        seeds = [file_hash.as_bytes()],
        bump,
    )]
    pub rhythmChain: Account<'info, RhythmChain>,
}

#[derive(Accounts)]
pub struct CloseRhythmChain<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        mut,
        close = payer,
    )]
    pub rhythmChain: Account<'info, RhythmChain>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub rhythmChain: Account<'info, RhythmChain>,
}

// Event emitted when music is verified
#[event]
pub struct MusicVerified {
    pub hash: String,
    pub owner: Pubkey,
    pub is_authentic: bool,
    pub file_name: String,
    pub file_author: String,
}

#[account]
#[derive(InitSpace, Debug)]
pub struct RhythmChain {
    // Add owner field to track who registered the music
    pub owner: Pubkey,
    
    #[max_len(64)] // sha256 hash in hex, each character is 4 bits
    file_hash: String,
    
    #[max_len(128)] // file name max is 128
    file_name: String,
    
    #[max_len(128)] // author name
    file_author: String,
    
    file_timestamp: u64,
    file_length: u64,
}