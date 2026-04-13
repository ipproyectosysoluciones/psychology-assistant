import { User } from '../../models/user.js';

describe('User Model', () => {
  describe('User creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'MySecurePass@2024',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email.toLowerCase());
      expect(savedUser.role).toBe('user');
      expect(savedUser.twoFAEnabled).toBe(false);
      expect(savedUser.isActive).toBe(true);
    });

    it('should fail with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'MySecurePass@2024',
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'MySecurePass@2024',
      };

      const user = new User(userData);
      await user.save();

      // Password should be hashed
      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(userData.password.length);
    });
  });

  describe('User methods', () => {
    let user: InstanceType<typeof User>;

    beforeEach(async () => {
      user = new User({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'MySecurePass@2024',
      });
      await user.save();
    });

    it('should compare password correctly', async () => {
      const isMatch = await (
        user as unknown as { comparePassword: (pwd: string) => Promise<boolean> }
      ).comparePassword('MySecurePass@2024');
      expect(isMatch).toBe(true);

      const isNotMatch = await (
        user as unknown as { comparePassword: (pwd: string) => Promise<boolean> }
      ).comparePassword('WrongPassword');
      expect(isNotMatch).toBe(false);
    });

    it('should exclude password and secret in toJSON', () => {
      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.twoFASecret).toBeUndefined();
      expect(json.name).toBe(user.name);
      expect(json.email).toBe(user.email);
    });
  });

  describe('User validation', () => {
    it('should require name', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });

      await expect(user.save()).rejects.toThrow('Name is required');
    });

    it('should require email', async () => {
      const user = new User({
        name: 'Test User',
        password: 'MySecurePass@2024',
      });

      await expect(user.save()).rejects.toThrow('Email is required');
    });

    it('should require password', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
      });

      await expect(user.save()).rejects.toThrow('Password is required');
    });

    it('should enforce unique email', async () => {
      await new User({
        name: 'User 1',
        email: 'duplicate@example.com',
        password: 'MySecurePass@2024',
      }).save();

      const user2 = new User({
        name: 'User 2',
        email: 'duplicate@example.com',
        password: 'Password456',
      });

      await expect(user2.save()).rejects.toThrow('Email already exists');
    });
  });
});
