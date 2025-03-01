#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod rhythmChain {
    use super::*;

  pub fn close(_ctx: Context<CloseRhythmChain>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.rhythmChain.count = ctx.accounts.rhythmChain.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.rhythmChain.count = ctx.accounts.rhythmChain.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeRhythmChain>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.rhythmChain.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeRhythmChain<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + RhythmChain::INIT_SPACE,
  payer = payer
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
  count: u8,
}
