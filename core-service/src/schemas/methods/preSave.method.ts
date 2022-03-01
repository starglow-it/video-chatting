import * as bcrypt from 'bcryptjs';

async function preSaveUser() {
  const now = Date.now();

  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;

    this.password = await bcrypt.hash(this.password, 10);
  }
  return this;
}

export { preSaveUser };
