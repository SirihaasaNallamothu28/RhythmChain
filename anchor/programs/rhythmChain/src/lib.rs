#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod rhythmChain {
    use super::*;

  //pub fn decrement(ctx: Context<Update>) -> Result<()> {
  //  ctx.accounts.rhythmChain.count = ctx.accounts.rhythmChain.count.checked_sub(1).unwrap();
  //  Ok(())
  //}
  //
  //pub fn increment(ctx: Context<Update>) -> Result<()> {
  //  ctx.accounts.rhythmChain.count = ctx.accounts.rhythmChain.count.checked_add(1).unwrap();
  //  Ok(())
  //}

  pub fn initialize(ctx: Context<InitializeRhythmChain>,
                    file_name :String, file_author :String, file_timestamp: u64,
        file_length: u64,
        file_hash: String) -> Result<()> {
    ctx.accounts.rhythmChain.name = file_name;
    ctx.accounts.rhythmChain.author = file_author;
    ctx.accounts.rhythmChain.timestamp = file_timestamp;
    ctx.accounts.rhythmChain.length = file_length;
    ctx.accounts.rhythmChain.file_hash = file_hash;

    msg!("RhythmChain initialized with values {:?}", ctx.accounts.rhythmChain);

    Ok(())
  }

}

#[derive(Accounts)]
#[instruction(file_name: String, file_author: String, file_timestamp: u64, file_length: u64, file_hash: String)] // ENSURE THIS ORDER IS CORRECT
pub struct InitializeRhythmChain<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,

  #[account(
  init,
  space = 8 + RhythmChain::INIT_SPACE,
  payer = signer, 
        seeds = [b"rhythmChain"],
        bump
        // bump = RhythmChain::bump(&ctx.accounts.signer.key().to_bytes()),
  )]
  
  pub rhythmChain: Account<'info, RhythmChain>,
  pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct CloseRhythmChain<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub rhythmChain: Account<'info, RhythmChain>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub rhythmChain: Account<'info, RhythmChain>,
}

#[account]
#[derive(InitSpace)]
pub struct RhythmChain {
  #[max_len(64)] // sha256 hash in hex, each character is 4 bits
  file_hash: String,

  #[max_len(128)] // file name max is 128
  file_name: String,

  #[max_len(128)] // author name
  file_author: String,
  file_timestamp: u64,
  file_length: u64,
}
