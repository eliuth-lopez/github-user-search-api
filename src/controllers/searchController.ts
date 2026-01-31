import { Request, Response } from 'express';
import { searchUsers as searchGithubUsers } from '../services/githubService';
import { validateSearchRequest } from '../shared/validators';
import { ErrorResponse, SuccessResponse } from '../services/responseService';
import { GithubSearchParams } from '../shared/customInterfaces';

interface SearchBody {
    query: string;
    limit?: number;
    page?: number;
}

export const searchUsers = async (req: Request<{}, {}, SearchBody>, res: Response) => {
    try {
        const { query, limit, page } = validateSearchRequest(req.body);

        const params: GithubSearchParams = {
            per_page: limit || 10,
            page: page || 1
        }

        const parsedQuery = parseQuery(query);
        params.q = parsedQuery.q;
        params.username = parsedQuery.username;
        params.location = parsedQuery.location;
        params.language = parsedQuery.language;
        params.followers = parsedQuery.followers;
        params.repos = parsedQuery.repos;
        params.sponsor = parsedQuery.sponsor;
        params.type = parsedQuery.type;

        const data = await searchGithubUsers(params);

        res.status(200).json(SuccessResponse({
            total_found_on_github: data.total_count,
            query_interpreted: data.query_interpreted
        }, data.items));

    } catch (error: any) {
        const result = ErrorResponse(error);
        res.status(result.code).json(result);
    }
};


/**
 * 
 * @param query Funtion to parse search at natural language to github search query
 * @param query Natural language search query
 * @returns Github search query
 */
function parseQuery(query: string): GithubSearchParams {

    const queryParts: GithubSearchParams = {};

    // search by sponsor capacity
    const sponsorCapacityRegex = /\b(sponsor|sponsored)\b/i;
    const sponsorCapacityMatch = sponsorCapacityRegex.exec(query);
    if (sponsorCapacityMatch) {
        queryParts.sponsor = true;
        query = query.replace(sponsorCapacityMatch[0], '').trim();
    }

    //earch by number of repositories
    const repositoriesRegex = /(?:with|few than|more than|\+)?\s*(\d+)\+?\s*repo/i;
    const repositoriesMatch = repositoriesRegex.exec(query);
    if (repositoriesMatch) {
        const repositories = repositoriesMatch[1].trim();
        if (repositoriesMatch[0].includes('few than')) {
            queryParts.repos = `<${repositories}`;
        } else if (repositoriesMatch[0].includes('more than')) {
            queryParts.repos = `>${repositories}`;
        } else {
            queryParts.repos = repositories;
        }
        query = query.replace(repositoriesMatch[0], '').trim();
    }


    // search by followers
    const followersRegex = /(?:with|few than|more than|\+)?\s*(\d+)\+?\s*followers/i;
    const followersMatch = followersRegex.exec(query);
    if (followersMatch) {
        const followers = followersMatch[1].trim();
        if (followersMatch[0].includes('more than')) {
            queryParts.followers = `>${followers}`;
        } else if (followersMatch[0].includes('few than')) {
            queryParts.followers = `<${followers}`;
        } else {
            queryParts.followers = followers;
        }
        query = query.replace(followersMatch[0], '').trim();
    }


    // search location
    const locationRegex = /\b(?:in|based in|from)\s+([a-zA-Z\s]+?)(?:\s+(?:with|and|,)|$)/i;
    const locationMatch = locationRegex.exec(query);
    if (locationMatch) {
        const location = locationMatch[1].trim();
        queryParts.location = location;
        query = query.replace(locationMatch[0], '').trim();
    }


    // search language
    const languages = ['javascript', 'typescript', 'nodejs', 'react', 'angular', 'vue', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'perl', 'bash', 'shell', 'html', 'css', 'sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'windows', 'macos', 'android', 'ios', 'flutter', 'react-native', 'ionic', 'cordova', 'vue', 'angular', 'svelte', 'next.js', 'nuxt.js', 'gatsby', 'express', 'koa', 'hapi', 'nestjs', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'symfony', 'yii', 'codeigniter', 'zend', 'cakephp', 'fuelphp', 'slim', 'lumen', 'silex', 'monolog', 'twig', 'smarty', 'blade', 'mustache', 'handlebars', 'ejs', 'pug', 'haml', 'slim', 'sass', 'scss', 'less', 'stylus', 'postcss', 'autoprefixer', 'babel', 'webpack', 'rollup', 'parcel', 'esbuild', 'vite', 'grunt', 'gulp', 'bower', 'npm', 'yarn', 'pnpm', 'composer', 'pip', 'nuget', 'maven', 'gradle', 'ant', 'make', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson', 'bazel', 'buck', 'pants', 'scons', 'cmake', 'autotools', 'meson'];

    languages.forEach(lang => {
        const escapedLang = lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const langRegex = new RegExp(`\\b${escapedLang}\\b`, 'i');
        if (langRegex.test(query)) {
            queryParts.language = lang;
        }
    })

    if (/node\.?js/i.test(query)) {
        queryParts.language = 'node';
    }

    // search by type user
    const typeRegex = /\b(user|organization|org)\b/i;
    const typeMatch = typeRegex.exec(query);
    if (typeMatch) {
        const type = typeMatch[1].trim();
        queryParts.type = type === 'organization' ? 'org' : type;
        query = query.replace(typeMatch[0], '').trim();
    }

    // search by name or email
    const userNameRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._%+-]+)\b/;
    const userNameMatch = userNameRegex.exec(query);
    if (userNameMatch) {
        const userName = userNameMatch[1].trim();
        queryParts.username = userName;
        query = query.replace(userNameMatch[0], '').trim();
    }

    queryParts.q = query;

    return queryParts;
}