export const CONTENT_SCHEMA_VERSION = 1;
export const CONTENT_STORAGE_KEY = 'CRMO_CONTENT_MANAGEMENT_V1';

export const defaultContent = {
  version: CONTENT_SCHEMA_VERSION,
  updatedAt: null,
  assets: {
    logoPath: 'assets/logo.png',
    faviconPath: 'assets/favicon.ico',
    heroImagePath: 'assets/hero.jpg'
  },
  galleries: [
    {
      key: 'featured',
      slug: 'featured',
      visible: true,
      hideOnMobile: false,
      expandPageEnabled: false,
      title: {
        mobile: 'עבודות נבחרות',
        desktop: 'עבודות נבחרות',
        expanded: 'תיק עבודות מורחב'
      },
      description: {
        mobile: 'פרויקטים נבחרים להצגה מהירה במובייל.',
        desktop: 'פרויקטים נבחרים שמציגים את עבודת הסטודיו.',
        expanded: 'כל העבודות של הקטגוריה במסך ייעודי ללקוח.'
      },
      tiles: [
        {
          id: 'featured__1',
          projectId: 'featured__1',
          client: 'לקוח א׳',
          title: 'מיתוג חברה',
          desc: 'שפה גרפית, לוגו ומסרים',
          href: '#',
          images: ['https://picsum.photos/seed/crmo-1/800/600']
        },
        {
          id: 'featured__2',
          projectId: 'featured__2',
          client: 'לקוח ב׳',
          title: 'אתר תדמית',
          desc: 'דף בית + עמודי תוכן',
          href: '#',
          images: ['https://picsum.photos/seed/crmo-2/800/600', 'https://picsum.photos/seed/crmo-2b/800/600']
        },
        {
          id: 'featured__3',
          projectId: 'featured__3',
          client: 'לקוח ג׳',
          title: 'קמפיין דיגיטלי',
          desc: 'דפי נחיתה ומודעות',
          href: '#',
          images: ['https://picsum.photos/seed/crmo-3/800/600']
        }
      ]
    },
    {
      key: 'exhibitions',
      slug: 'exhibitions',
      visible: true,
      hideOnMobile: false,
      expandPageEnabled: true,
      title: {
        mobile: 'תערוכות',
        desktop: 'תערוכות',
        expanded: 'תערוכות — מצב מורחב'
      },
      description: {
        mobile: 'עבודות נבחרות מתערוכות.',
        desktop: 'פרויקטים מעולם התערוכות והחללים.',
        expanded: 'עמוד ייעודי לשיתוף גלריית תערוכות מורחבת עם לקוח.'
      },
      tiles: Array.from({ length: 12 }).map((_, index) => ({
        id: `exhibitions__${index + 1}`,
        projectId: `exhibitions__${index + 1}`,
        client: 'תערוכה',
        title: `עבודה ${index + 1}`,
        desc: `תיאור עבודה ${index + 1}`,
        href: '#',
        images: [`https://picsum.photos/seed/exhibitions-${index + 1}/800/600`]
      }))
    }
  ]
};
