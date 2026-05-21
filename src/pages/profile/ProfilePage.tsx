import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../widgets/Header';
import { Footer } from '../../widgets/Footer';
import { Input } from '../../shared/ui/input';
import { Button } from '../../shared/ui/button';
import { selectUser, updateUser, logout } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAbout(user.about || '');
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    setIsSaving(true);
    setMessage('');

    try {
      dispatch(updateUser({ name, about }));
      setMessage('Данные успешно обновлены');
    } catch (error) {
      setMessage('Ошибка при обновлении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.title}>Профиль</h1>
            <div className={styles.notAuth}>
              <p>Вы не авторизованы</p>
              <Button color="green" onClick={() => navigate('/login')}>
                Войти
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Профиль</h1>

          <div className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <img
                src={user.avatar || '/images/avatars/default.jpg'}
                alt="avatar"
                className={styles.avatar}
              />
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input type="email" value={user.email} disabled className={styles.disabledInput} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Имя</label>
                <Input value={name} onValueChange={setName} placeholder="Ваше имя" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>О себе</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Расскажите о себе"
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              {message && (
                <div className={message.includes('успешно') ? styles.success : styles.error}>
                  {message}
                </div>
              )}

              <div className={styles.buttons}>
                <Button color="green" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button color="white" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
