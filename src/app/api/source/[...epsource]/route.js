import axios from 'axios'
import { redis } from '@/lib/rediscache';
import { NextResponse, NextRequest } from "next/server"

async function consumetEpisode(id, subtype) {
    try {
      // Instead of using subType parameter, check if subtype is 'dub' and set the dub parameter
      const isDub = subtype?.toLowerCase() === 'dub';
      console.log(`Making Consumet API request: ${process.env.API_URI}/watch?episodeId=${id}?dub=${isDub}`);
      
      const { data } = await axios.get(
        `${process.env.API_URI}/watch?episodeId=${id}?dub=${isDub}`
      );
      
      console.log(`Received response from Consumet API with ${data?.sources?.length || 0} sources for ${isDub ? 'DUB' : 'SUB'} request`);
      
      // Apply m3u8 proxy to sources for CORS handling
      if (data && data.sources) {
        const headers = {};
        if (data.headers?.Referer) {
          headers.Referer = data.headers.Referer;
        }
        if (data.headers?.['User-Agent']) {
          headers['User-Agent'] = data.headers['User-Agent'];
        }
        
        // Use Vercel m3u8 proxy with headers - as used in Player.jsx
        data.sources = data.sources.map(source => {
          if (source.isM3U8 || source.url.includes('.m3u8')) {
            return {
              ...source,
              url: `${process.env.NEXT_PUBLIC_PROXY_URI}/api/m3u8-proxy?url=${encodeURIComponent(source.url)}&headers=${encodeURIComponent(JSON.stringify(headers))}`
            };
          }
          return source;
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error in consumetEpisode: ${error.message}`);
      return null;
    }
  }

async function zoroEpisode(provider, episodeid, epnum, id, subtype) {
    try {
      const isDub = subtype?.toLowerCase() === 'dub';
      const cleanEpisodeId = episodeid.replace("/watch/", "");
      console.log(`Making Zoro API request for ${isDub ? 'DUB' : 'SUB'} content`);
      
      // For category, pass 'dub' or 'sub' directly based on subtype
      const category = isDub ? 'dub' : 'sub';
      const { data } = await axios.get(`${process.env.ZORO_URI}/anime/episode-srcs?id=${cleanEpisodeId}&server=vidstreaming&category=${category}`);
      
      // Apply m3u8 proxy to sources for CORS handling
      if (data && data.sources) {
        const headers = {};
        if (data.headers?.Referer) {
          headers.Referer = data.headers.Referer;
        }
        
        // Use Vercel m3u8 proxy with headers - as used in Player.jsx
        data.sources = data.sources.map(source => {
          if (source.isM3U8 || source.url.includes('.m3u8')) {
            return {
              ...source,
              url: `${process.env.NEXT_PUBLIC_PROXY_URI}/api/m3u8-proxy?url=${encodeURIComponent(source.url)}&headers=${encodeURIComponent(JSON.stringify(headers))}`
            };
          }
          return source;
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error in zoroEpisode: ${error.message}`);
      return AnifyEpisode(provider, episodeid, epnum, id, subtype);
    }
  }
  
  async function AnifyEpisode(provider, episodeid, epnum, id, subtype) {
    try {
      const isDub = subtype?.toLowerCase() === 'dub';
      console.log(`Making Anify API request for ${isDub ? 'DUB' : 'SUB'} content, ID: ${id}`);
      
      // Anify API appears to use subType parameter (with capital T)
      const { data } = await axios.get(
        `https://anify.eltik.cc/sources?providerId=${provider}&watchId=${encodeURIComponent(
          episodeid
        )}&episodeNumber=${epnum}&id=${id}&subType=${isDub ? 'dub' : 'sub'}`
      );
      
      // Apply m3u8 proxy to sources for CORS handling
      if (data && data.sources) {
        const headers = {};
        if (data.headers?.Referer) {
          headers.Referer = data.headers.Referer;
        }
        if (data.headers?.['User-Agent']) {
          headers['User-Agent'] = data.headers['User-Agent'];
        }
        
        // Use Vercel m3u8 proxy with headers - as used in Player.jsx
        data.sources = data.sources.map(source => {
          if (source.isM3U8 || source.url.includes('.m3u8')) {
            return {
              ...source,
              url: `${process.env.NEXT_PUBLIC_PROXY_URI}/api/m3u8-proxy?url=${encodeURIComponent(source.url)}&headers=${encodeURIComponent(JSON.stringify(headers))}`
            };
          }
          return source;
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error in AnifyEpisode: ${error.message}`);
      return null;
    }
  }

export const POST = async (req,{params}) => {
  const id = params.epsource[0];
  const {source, provider, episodeid, episodenum, subtype} = await req.json();
    // let cacheTime = 25 * 60;
    // let cached = await redis.get(`source:${params.epid[0]}`);

    // if (cached) {
    //     const cachedData = JSON.parse(cached);
    //     return NextResponse.json(cachedData);
    //   } else {
    //     const data = await consumetEpisode(params.epid[0]);
    
    //     await redis.setex(`source:${params.epid[0]}`, cacheTime, JSON.stringify(data));
    
    //     return NextResponse.json(data);
    //   }

    const isDub = subtype?.toLowerCase() === 'dub';
    console.log(`API Request received: source=${source}, provider=${provider}, episodeid=${episodeid}, episodenum=${episodenum}, id=${id}, subtype=${subtype}, isDub=${isDub}`);
    
    if (source === "consumet") {
      const data = await consumetEpisode(episodeid, subtype);
      return NextResponse.json(data);
    }

    if (source === "anify" && provider === "zoro") {
      const data = await zoroEpisode(provider, episodeid, episodenum, id, subtype);
      return NextResponse.json(data);
    }

    if(source === "anify"){
      const data = await AnifyEpisode(provider, episodeid, episodenum, id, subtype);
      return NextResponse.json(data);
    }
}
