package com.xenoreach.crm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleSheetsService {

    private final CsvImportService csvImportService;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    // Matches standard Google Sheets URLs and extracts the document ID
    private static final Pattern SHEETS_URL_PATTERN = Pattern.compile("/spreadsheets/d/([a-zA-Z0-9-_]+)");

    public int importFromUrl(String url) {
        String csvUrl = url;

        // If it's a standard sheets URL, convert it to the CSV export endpoint
        Matcher matcher = SHEETS_URL_PATTERN.matcher(url);
        if (matcher.find()) {
            String sheetId = matcher.group(1);
            csvUrl = "https://docs.google.com/spreadsheets/d/" + sheetId + "/export?format=csv";
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(csvUrl))
                    .GET()
                    .build();

            HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return csvImportService.importCustomers(response.body());
            } else {
                throw new RuntimeException("Failed to fetch Google Sheet: HTTP " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("Error importing from Google Sheets URL: {}", url, e);
            throw new RuntimeException("Failed to import from Google Sheets: " + e.getMessage());
        }
    }
}
