# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Create a local `frontend/.env` file from `frontend/.env.example`.

Required for admin project media uploads:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

For Vercel, add the same variables in Project Settings → Environment Variables for Production, Preview, and Development, then redeploy the project. Create React App reads `REACT_APP_*` values at build time, so a redeploy is required after changing them.

## Available Scripts

### Production SEO and indexing

The primary URL is https://muhammad-rizwan-portfolio-xi.vercel.app/.
The HTML canonical, Open Graph URLs, Person/ProfilePage structured data, robots.txt, and sitemap all use this address. The sitemap intentionally lists only the homepage: section anchors are not separate pages.

After deploying these changes:

1. Add a **URL-prefix** property for the exact production URL in [Google Search Console](https://search.google.com/search-console/).
2. Verify ownership using Google's provided HTML file (place it in `public/`) or HTML verification meta tag (add the exact tag to `public/index.html`), then redeploy. Never invent a verification token.
3. Submit `sitemap.xml` in the property's Sitemaps screen.
4. Inspect the homepage URL, test the live URL, and request indexing. Check the rendered page and Google's selected canonical.
5. Link this portfolio from your real GitHub, LinkedIn, and other profiles. Add only confirmed profile URLs to structured data's `sameAs` when available.

Google does not guarantee indexing or first-place rankings. Useful project details and consistent name/role/location signals help distinguish this developer profile; ranking for a common name depends on competition and the searcher's context. A paid hosting upgrade does not purchase rankings.

If you move to a custom domain, update the canonical and absolute URLs in `public/index.html`, `public/robots.txt`, `public/sitemap.xml`, and `scripts/check-seo.cjs` together, then redirect the old primary hostname in Vercel.

Every production build runs `npm run check:seo` automatically. The check validates output metadata, JSON-LD relationships, sitemap URLs, assets, and admin noindex headers. The Vercel rewrite is limited to the existing admin route so unknown URLs return genuine 404s. Fingerprinted static assets receive long-lived caching.

The public homepage is still a client-rendered React app; Google must render JavaScript to read its interactive content. Use Search Console's rendered-page inspection to verify it after deployment. No live Core Web Vitals or Lighthouse score is claimed by these source-level checks.

### UI and delivery checks

`CI=true npm test -- --watchAll=false --runInBand --watchman=false` runs the interaction and media tests.

The admin page, its styles, and Firebase Auth load only on the admin route. Project cards use compact 3/2/1-column layouts, consistent title/description rows, and limited preview tags; complete content remains in the detail dialog. Public Cloudinary image previews request automatic format/quality and a 640px width cap; original media remain available in the gallery.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
