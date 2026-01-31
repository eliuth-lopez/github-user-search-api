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
        }, data.items.map((user: any) => {
            return {
                username: user.login,
                url: user.html_url,
                avatar: user.avatar_url,
                score: user.score || 0,
            }
        })));

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
    const repositoriesRegex = /(?:with|few than|more than|\+)?\s*(\d+)(\+)?\s*repo/i;
    const repositoriesMatch = repositoriesRegex.exec(query);
    if (repositoriesMatch) {
        const repositories = repositoriesMatch[1].trim();
        if (repositoriesMatch[0].includes('few than')) {
            queryParts.repos = `<${repositories}`;
        } else if (repositoriesMatch[0].includes('more than') || repositoriesMatch[2] === '+') {
            queryParts.repos = `>${repositories}`;
        } else {
            queryParts.repos = repositories;
        }
        query = query.replace(repositoriesMatch[0], '').trim();
    }


    // search by followers
    const followersRegex = /(?:with|few than|more than|\+)?\s*(\d+)(\+)?\s*followers/i;
    const followersMatch = followersRegex.exec(query);
    if (followersMatch) {
        const followers = followersMatch[1].trim();
        if (followersMatch[0].includes('more than') || followersMatch[2] === '+') {
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
        queryParts.location = location.toLowerCase();
        query = query.replace(locationMatch[0], '').trim();
    }


    // search language
    const languages = [
        "ActionScript", "Ada", "Agda", "Arduino", "ASP.NET", "Assembly", "Astro", "AutoIt",
        "Batchfile", "C", "C#", "C++", "Clojure", "CMake", "COBOL", "CoffeeScript",
        "Common Lisp", "CSS", "Cuda", "D", "Dart", "Dockerfile", "Elixir", "Elm", "Emacs Lisp",
        "Erlang", "F#", "Fortran", "Go", "GDScript", "GraphQL", "Groovy", "Haskell", "HCL",
        "HTML", "Java", "JavaScript", "JSON", "Julia", "Jupyter Notebook", "Kotlin", "Less",
        "LUA", "Makefile", "Markdown", "MATLAB", "Nix", "Objective-C", "OCaml", "Pascal",
        "Perl", "PHP", "PLpgSQL", "PowerShell", "Prolog", "Protocol Buffer", "Python", "R",
        "Racket", "Ruby", "Rust", "SAS", "Scala", "Scheme", "SCSS", "Shell", "Solidity",
        "SQL", "Svelte", "Swift", "Tcl", "Terraform", "TeX", "TypeScript", "VBA", "VHDL",
        "Verilog", "Visual Basic .NET", "Vue", "WebAssembly", "YAML", "Zig"
    ]
    languages.forEach(lang => {
        // escape special characters from language name
        const escapedLang = lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // create regex to match language name
        const langRegex = new RegExp(`\\b${escapedLang}\\b`, 'i');

        if (langRegex.test(query)) {
            queryParts.language = lang.toLowerCase();
            // remove language name from query
            query = query.replace(langRegex, '').trim();
        }
    })

    if (/node\.?js/i.test(query)) {
        queryParts.language = 'node';
        query = query.replace(/node\.?js/i, '').trim();
    }


    // search by type user
    const typeRegex = /\b(user|organization|org)\b/i;
    const typeMatch = typeRegex.exec(query);
    if (typeMatch) {
        const type = typeMatch[1].trim();
        queryParts.type = type === 'organization' ? 'org' : type;
        query = query.replace(typeMatch[0], '').trim();
    }


    // search contributor
    const contributorRegex = /\b(contributor|maintainer)\b/i;
    const contributorMatch = contributorRegex.exec(query);
    if (contributorMatch) {
        const contributor = contributorMatch[1].trim();
        queryParts.repos = '>1';
        query = query.replace(contributor, '').trim();
    }


    const roleRegex = /\b(developer|engineer|architect|designer|tester|analyst|consultant|manager|director|lead|principal|senior|junior|entry|level)\b/i;
    const roleMatch = roleRegex.exec(query);
    if (roleMatch) {
        const role = roleMatch[1].trim();
        queryParts.type = 'user';
        query = query.replace(role, '').trim();
    }

    // delete points, plus signs and commas
    query = query.replace(/[.,+]/g, '').trim();


    queryParts.q = query.replace(/\s+/g, ' ').trim();

    return queryParts;
}